# This file contains the functions that interact with the database
# database_functions.py
import os
import re

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pokemontcgsdk import Card
from priceScraping import get_price_charting_data
from serializer import serialize_cardgen_list

load_dotenv()
# MongoDB connection details
MONGO_DETAILS = os.getenv("DATABASE_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["test"]
prices_db = database["prices"]
products_db = database["products"]
cards_db = database["cards"]
cardsets_db = database["cardsets"]
cardgens_db = database["cardgens"]
tracker_db = database['setTracker']

def serialize_document(card: dict) -> dict:
    if card is not None:
        # Convert the ObjectId to a string.
        if "_id" in card:
            card["_id"] = str(card["_id"])
    return card

def recursive_serialize(obj):
    if isinstance(obj, list):
        return [recursive_serialize(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: recursive_serialize(value) for key, value in obj.items()}
    else:
        return obj

async def fix_rarity_db():
    # Fetch all cardSets from the API
    card_sets = get_all_cardsets()

    # Loop through each cardSet
    async for card_set in card_sets:
        card_set_name = card_set.get("name")
        rarityList = []
        print(f"Processing cardSet: {card_set_name}")
        cards = await get_cardset_cards(card_set_name)
        for card in cards:
            rarity = card.get("rarity")
            if rarity not in rarityList:
                print(f"Adding rarity: {rarity}")
                rarityList.append(rarity)
        print(f"Rarity list: {rarityList}")
        await updateCardSetAddRarity(card_set_name, rarityList)
    return "Success"

async def updateCardSetAddRarity(setName: str, rarityList: list):
    cardSet = await cardsets_db.find_one({"name": setName})
    cardSet["rarities"] = rarityList
    await cardsets_db.update_one({"name": setName}, {"$set": cardSet})


#=======================================================================================================
# FUNCTIONS: FETCH FINALIZED FUNCTIONS FOR API CALLS
#=======================================================================================================
async def db_fetch_price_single_card(set_name: str, card_name: str, card_number: str, rarity: str) -> dict:
    price_set = await prices_db.find_one({"name": set_name})
    price = price_set['cardPrices'][rarity][card_name]
    return price

async def db_fetch_data_single_card(set_name: str, card_name: str, card_number: str) -> dict:
    card = await cards_db.find_one({"set": set_name, "name": card_name, "number": card_number})
    return card

async def db_fetch_data_all_cards_in_set(
    set_name: str, 
    page: int = 1, 
    page_size: int = 40,
    filters: dict = None,
    sort_by: str = "number",
    sort_order: int = 1
) -> dict:
    try:
        skip = (page - 1) * page_size
        query = {"set": set_name}
        
        # Add any additional filters
        if filters:
            query.update(filters)
        
        # Get total count for pagination info
        total_count = await cards_db.count_documents(query)
        
        # Determine sorting
        sort_field = sort_by
        
        if sort_by == "number":
            pipeline = [
                {"$match": query},
                {"$sort": {"sortableNumber": sort_order}},
                {"$skip": skip},
                {"$limit": page_size},
                {"$project": {"numberSuffix": 0}}
            ]

            cursor = cards_db.aggregate(pipeline)
            cards = await cursor.to_list(length=page_size)
        
        elif sort_by == "name":
            # Ensure case-insensitive sorting for names
            pipeline = [
                {"$match": query},
                {"$addFields": {"nameLower": {"$toLower": "$name"}}},
                {"$sort": {"nameLower": sort_order}},
                {"$skip": skip},
                {"$limit": page_size},
                {"$project": {"nameLower": 0}}
            ]
            cursor = cards_db.aggregate(pipeline)
            cards = await cursor.to_list(length=page_size)
            
        elif sort_by == "price":
            # For price sorting, we need to fetch all cards first and sort them manually
            # since price data is added after the initial database query
            
            # Get all matching cards first
            cursor = cards_db.find(query)
            all_cards = await cursor.to_list(length=1000)  # Reasonable limit
            
            # Process prices for all cards
            all_cards_with_prices = []
            for card in all_cards:
                combined_card_data = await db_combine_card_data_with_price(set_name, card)
                
                # Extract the price value for sorting (default to 0 if not found)
                try:
                    price_value = 0
                    if combined_card_data.get('price', {}).get('price', {}).get('Ungraded'):
                        price_str = combined_card_data['price']['price']['Ungraded'].replace('$', '').replace(',', '')
                        price_value = float(price_str)
                except (ValueError, AttributeError, KeyError):
                    # If price conversion fails, default to 0
                    price_value = 0
                
                # Add price_value for sorting
                combined_card_data['_sort_price'] = price_value
                all_cards_with_prices.append(combined_card_data)
            
            # Sort the cards by price
            all_cards_with_prices.sort(
                key=lambda card: card.get('_sort_price', 0),
                reverse=(sort_order == -1)
            )
            
            # Apply pagination
            paginated_cards = all_cards_with_prices[skip:skip+page_size]
            
            # Remove the temporary sorting field
            for card in paginated_cards:
                if '_sort_price' in card:
                    del card['_sort_price']
            
            # Skip the regular processing loop since we've already processed these cards
            return {
                "data": paginated_cards,
                "total": total_count,
                "page": page,
                "page_size": page_size,
                "pages": (total_count + page_size - 1) // page_size,
                "filters": filters or {}
            }
        
        else:
            # Default sorting for other fields
            cursor = cards_db.find(query).sort(sort_field, sort_order).skip(skip).limit(page_size)
            cards = await cursor.to_list(length=page_size)
        
        # Build output list with prices
        
        output = []
        for card in cards:
            combined_card_data = await db_combine_card_data_with_price(set_name, card)
            output.append(combined_card_data)
        # Return data with pagination information
        return {
            "data": output,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "pages": (total_count + page_size - 1) // page_size,
            "filters": filters or {}
        }
        
    except Exception as e:
        import logging
        exception_type = type(e).__name__
        logging.error(f"Error in db_fetch_data_all_cards_in_set: {exception_type} {str(e)}")
        # Return empty response with error information
        return {
            "data": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
            "pages": 0,
            "error": str(e)
        }

    
async def db_combine_card_data_with_price(set_name: str, card_data: dict) -> dict:
    card_name = card_data.get("name", "")
    card_number = card_data.get("number", "")
    card_rarity = card_data.get("rarity", "")
    print(f"Fetching price for card: {card_name} | {card_number} | {card_rarity}")
    card_price = await db_fetch_price_single_card(set_name, card_name, card_number, card_rarity)
    print(f"Card price: {card_price}")
    if card_data:
        card_data['price'] = card_price
    return serialize_document(card_data) if card_data else {}

async def db_fetch_combined_card_data(set_name: str, card_name: str, card_number: str) -> dict:
    card_data = await db_fetch_data_single_card(set_name, card_name, card_number)
    print(card_data.get("rarity", "No Rarity"))
    card_price = await db_fetch_price_single_card(set_name, card_name, card_number, card_data.get("rarity", "No Rarity"))
    if card_data:
        card_data['price'] = card_price
    return serialize_document(card_data) if card_data else {}

async def db_fetch_render_collections(set_name: str) -> dict:
    # Grab all the cards in the set...
    cards_in_set = cards_db.find({"set": set_name}).sort("number")
    cards = await cards_in_set.to_list(length=500)
    card_data = []
    for card in cards:
        card_data.append(serialize_document(card))

    return card_data


async def db_fetch_all_cardgens() -> dict:
    raw_docs = await cardgens_db.find({}).to_list(length=300)
    return serialize_cardgen_list(raw_docs)

async def db_fetch_set_rarities(set_name: str) -> dict:
    card_set = await cardsets_db.find_one({"name": set_name})
    rarities = card_set['rarities']
    print(f"Rarities for set {set_name}: {rarities}")
    if rarities == [None]:
        # If no rarities are found, return an empty list
        print(f"No rarities found for set: {set_name}")
        return []
    return sorted(rarities)

async def db_fetch_set_roipage() -> list:
    card_sets = products_db.find({})
    card_set_list = await card_sets.to_list(length=300)
    return process_setlist_roipage(card_set_list)


# Helpoer functions
def round_to_decimal_places(num, decimal_places):
    """Rounds a number to the specified number of decimal places."""
    factor = 10 ** decimal_places
    return round(num * factor) / factor

def process_setlist_roipage(data_list):
    """
    Processes a list of documents and returns a list of dictionaries with:
      - id: the document id
      - set: the set name
      - packPrice: the first element in productPrices["Pack"]
      - expectedValue: the second element in productPrices["Pack"]
      - simpleROI: (expectedValue - packPrice) / packPrice, rounded to 2 decimals
    """
    output = []
    for document in data_list:
        # Get the underlying document. Adjust this if your data structure is different.
        item = document.get("_doc", document)
        price = item["productPrices"]["Pack"][0]
        ev = item["productPrices"]["Pack"][1]
        roi = round_to_decimal_places((ev - price) / price, 2)
        obj = {
            'id': str(item["_id"]),
            'set': item["set"],
            'packPrice': price,
            'expectedValue': ev,
            'simpleROI': roi,
        }
        output.append(obj)
    return output

'''
=======================================================================================================
Get functions
=======================================================================================================
'''
def get_price_for_cardset(set_name: str) -> dict:
    return cards_db.find({"set": set_name})
    

# Returns a dict of all prices in a set subdivided by rarity
def db_fetch_price_set(set_name: str):
    return prices_db.find_one({"name": set_name})

def get_all_cardsets() -> list:
    return cardsets_db.find({})

def get_cardset_data(set: str) -> dict:
    return cardsets_db.find_one({"name": set})

async def get_generation_from_set(set: str) -> str:
    set_data = await cardsets_db.find_one({"name": set})
    return set_data["series"]

async def get_cardset_cards(set: str) -> dict:
    cursor = cards_db.find({"set": set})
    cards = await cursor.to_list(length=600)
    for card in cards:
        card["_id"] = str(card["_id"])
    return cards

async def get_product_data(product: str, set: str) -> dict:
    set_products = await products_db.find_one({"set": set})
    product_list = set_products["products"]
    if product in product_list:
        return product_list[product]
    else:
        return {}


async def get_pullrates(set: str) -> dict:
    set_pullrates = await cardsets_db.find_one({"name": set})
    pullrates = set_pullrates["rarityPullrates"]
    return pullrates

def get_single_card_price(set_name: str, card_name: str, card_number: str) -> dict:
    return {}

def get_set_card_prices(set_name: str, card_name: str, card_number: str) -> dict:
    card_prices = {}
    # Get the card prices from the database

    return card_prices

async def get_trivial_roi(good: str, set: str) -> dict:
    sets_products = await products_db.find_one({"set": set})
    good_data = sets_products["products"][good]
    trivial_roi = good_data["Expected Value"]
    return trivial_roi

async def get_rarity_prices(rarity: str, set_name: str) -> float:
    #Trivialize energy
    if "Energy" in rarity:
        return 0.50
    set_card_prices = await prices_db.find_one({"name": set_name})
    if not set_card_prices or "cardPrices" not in set_card_prices:
        return 0

    rarity_data = set_card_prices["cardPrices"].get(rarity, {})
    if not rarity_data:
        return 0

    total_price = 0
    count = 0

    for card_name, card_info in rarity_data.items():
        if "price" in card_info and "Ungraded" in card_info["price"]:
            price_str = card_info["price"]["Ungraded"].replace('$', '').replace(',', '')
            price = float(price_str)
            total_price += price
            count += 1
    return total_price / count if count else 0





'''
Post functions
'''
async def importSetsToPrice() -> str:
    try:
        print("importing")
        set_data = cardsets_db.find({})
        print(set_data)
        async for set in set_data:
            set_object = {
                "name": set["name"],
                "id": set["id"],
                "cardPrices": {}
            }
            print(set_object)
            await prices_db.insert_one(set_object)
        return "Success"
    except Exception as e:
        return str(e)

'''
=================================
Update functions
=================================
'''

def update_set_card_prices(set_name: str) -> str:
    try:
        # Get the card data for the set
        set_card_data = get_cardset_cards(set_name)
        for card in set_card_data:
            card_price = get_single_card_price(set_name, card["name"], card["number"])
            update_card_price(set_name, card["name"], card["number"], card_price)
        return "Success"
    except Exception as e:
        return str(e)

'''
For every card set in prices, update the cardPrices to have a full list of all cards and current json prices
'''
async def import_set_card_prices(set_name: str) -> str:
    try:
        watchlist = []
        setCards = await get_cardset_cards(set_name)
        set_in_priceDB = await prices_db.find_one({"name": set_name})
        set_card_data = set_in_priceDB["cardPrices"]
        generation_name = await get_generation_from_set(set_name)
        for card in setCards:
            print("card id:", card["id"])
            if card["varients"] != []:
                # create obj to add to list for every varient
                for varient in card["varients"]:
                    card_price = await get_price_charting_data(generation_name,set_name, card["name"], card["number"], varient)
                    card_object = {
                        "name": card["name"],
                        "number": card["number"],
                        "price": card_price,
                        "rarity": varient
                    }
                    if varient not in set_card_data:
                        set_card_data[varient] = {}
                    set_card_data[varient][card["name"]] = card_object

            card_price = await get_price_charting_data(generation_name,set_name, card["name"], card["number"])

            cardprice_default = {
                "Ungraded": "$-",
                "Grade 1": "-",
                "Grade 2": "-",
                "Grade 3": "-",
                "Grade 4": "-",
                "Grade 5": "-",
                "Grade 6": "-",
                "Grade 7": "-",
                "Grade 8": "$-",
                "Grade 9": "$-",
                "Grade 9.5": "$-",
                "SGC 10": "$-",
                "CGC 10": "$-",
                "PSA 10": "$-",
                "BGS 10": "$-",
                "BGS 10 Black": "$-",
                "CGC 10 Pristine": "$-"
            }

            card_rarity = card.get("rarity", "No Rarity")
            if card_rarity == "No Rarity":
                watchlist.append(card["id"])
            card_object = {
                "name": card["name"],
                "number": card["number"],
                "price": card_price if card_price != {} else cardprice_default,
                "rarity": card_rarity
            }
            if card_rarity not in set_card_data:
                set_card_data[card_rarity] = {}
            set_card_data[card_rarity][card["name"]] = card_object
        print("watchlist: ", watchlist)
        await prices_db.update_one({"name": set_name}, {"$set": {"cardPrices": set_card_data}})
        return {
            "watchlist": watchlist,
        }
    except Exception as e:
        exception_type = type(e).__name__
        print(f"An error occurred in import_set_card_prices: {exception_type} {e}")
        return "error"

'''
Updates the varients for test set 151
'''
async def updateRarity(newRarity: str, setName: str,  cardNumber: str):
    oldCardObject = await cards_db.find_one({"set": setName, "number": cardNumber})
    varients = oldCardObject["varients"]
    print(varients)
    varients.append(newRarity)
    print(varients)
    await cards_db.update_one({"set": setName, "number": cardNumber}, {"$set": {"varients": varients}})
    print("updated")

'''
Inserst new varients for a card set
'''
    
'''
Problem: data inconsistency and not prepped
solution: use webscrapping to update the rarity of reverse holos via price charting
process: go to the web page, download all the card names then find any cards containing reverse holo or holo or cosmos holo or 
'''

async def updateVarients(setname: str):
    print("updating varients for set: " + setname)
    cards_db.update_many({"set": setname}, {"$set": {"varients": []}})


async def fix_limited_retrival_set_list_bug():
    query = {
        "$or": [
            {"total": {"$gt": 300}},
            {"name": "Journey Together"}
        ]
    }

    results = await cardsets_db.find(query).to_list(length=None)
    
    # Properly serialize ObjectId fields before returning
    serialized_results = []
    for result in results:
        # Convert ObjectId to string
        result["_id"] = str(result["_id"])
        serialized_results.append(result)
    
    print("Results:")
    for result in serialized_results:
        print(result)
    second_results = []
    empty_prices_query = {
        "$or": [
            {"cardPrices": {}},  # Empty object
            {"cardPrices": {"$exists": False}},  # Field doesn't exist
            {"cardPrices": {"$size": 0}}  # Empty array (if it's an array)
        ]
    }
    empty_prices_results = await prices_db.find(empty_prices_query).to_list(length=None)
    # Serialize these results too
    empty_prices_serialized = []
    for result in empty_prices_results:
        # Convert ObjectId to string
        result["_id"] = str(result["_id"])
        empty_prices_serialized.append(result)
    
    print("\nSets with empty cardPrices:")
    for result in empty_prices_serialized:
        print(f"Set: {result.get('name')}")
    
    # For each set that is large, insert the varients for the documents then fetch price
    for result in serialized_results:
        set_name = result.get("name")
        print(f"Processing set: {set_name}")
        # Fetch the cards in the set
        cards = await get_cardset_cards(set_name)
        for card in cards:
            card_id = card.get("id")
            # Check if the card has a varient
            if "varients" in card and len(card["varients"]) > 0:
                print(f"Card {card_id} already has varients, skipping.")
                continue
            else:
                await cards_db.update_one(
                    {"id": card_id},
                    {"$set": {"varients": []}}
                ) 
        print("Fetching prices for set...")
        result = await import_set_card_prices(set_name)
        
    # For each set that has no prices, fetch the prices
    for result in empty_prices_serialized:
        set_name = result.get("name")
        print(f"Processing set: {set_name}")
        cards = await get_cardset_cards(set_name)
        for card in cards:
            card_id = card.get("id")
            # Check if the card has a varient
            if "varients" in card and len(card["varients"]) > 0:
                print(f"Card {card_id} already has varients, skipping.")
                continue
            else:
                await cards_db.update_one(
                    {"id": card_id},
                    {"$set": {"varients": []}}
                )

        print("Fetching prices for set...")
        result = await import_set_card_prices(set_name)
    return result



async def fix_keyerrors_cards():
    cards = await cards_db.find({
    "$or": [
        {"rarity": {"$exists": False}},  # rarity field doesn't exist
        {"rarity": None},                # rarity field is null
        {"rarity": ""}                   # rarity field is empty string
    ]
    }).to_list(length=None)
    return {
        "fixed_cards": [serialize_document(card) for card in cards]
    }

async def importNoRarityCards():
    # Fetch all cards with no rarity
    no_rarity_cards = await cards_db.find({"rarity": "No Rarity"}).to_list(length=None)
    
    # Process each card
    for card in no_rarity_cards:
        card_name = card.get("name")
        card_number = card.get("number")
        set_name = card.get("set")
        
        # Fetch the price data for the card
        price_data = await get_price_charting_data(set_name, set_name, card_name, card_number)
        
        # Update the card with the fetched price data
        if price_data:
            await cards_db.update_one(
                {"_id": card["_id"]},
                {"$set": {"price": price_data}}
            )
    
    return "No Rarity cards updated successfully."


async def fix_limited_retrival_set_list_bug2():
    query = {
        "$or": [
            {"total": {"$gt": 300}},
            {"name": "Journey Together"}
        ]
    }

    results = await cardsets_db.find(query).to_list(length=None)
    
    # Properly serialize ObjectId fields before returning
    serialized_results = []
    for result in results:
        # Convert ObjectId to string
        result["_id"] = str(result["_id"])
        serialized_results.append(result)
    
    print("Results:")
    for result in serialized_results:
        print(result)
    empty_prices_query = {
        "$or": [
            {"cardPrices": {}},  # Empty object
            {"cardPrices": {"$exists": False}},  # Field doesn't exist
            {"cardPrices": {"$size": 0}}  # Empty array (if it's an array)
        ]
    }
    empty_prices_results = await prices_db.find(empty_prices_query).to_list(length=None)
    # Serialize these results too
    empty_prices_serialized = []
    for result in empty_prices_results:
        # Convert ObjectId to string
        result["_id"] = str(result["_id"])
        empty_prices_serialized.append(result)
    
    print("\nSets with empty cardPrices:")
    for result in empty_prices_serialized:
        print(f"Set: {result.get('name')}")
    
    return {
        "large Sets": serialized_results,
        "empty prices": empty_prices_serialized
    }

def fix_products_db(set_name):

    # Define the JSON structure as described.
    document = {
        "set": set_name,
        "products": {
            "pack": [["Energy"], ["Common"], ["Common"], ["Common"], ["Uncommon"], ["Uncommon"], ["Uncommon"], ["Reverse Holo 1", "ACE SPEC Rare"], ["Reverse Holo 2", "Illustration Rare", "Special Illustration Rare", "Hyper Rare"],
                ["Rare", "Double Rare","Ultra Rare"]],        
            "etb": {},
            "boosterBox": {}
        }
    }
    result = products_db.insert_one(document)
    print(f"Inserted document")
    return "meow"
