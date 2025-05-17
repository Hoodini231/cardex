# This file contains the functions that interact with the database
# database_functions.py
import os

from dotenv import load_dotenv
from pymongo import MongoClient
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

async def fix_shit(card_name: str):
    card = Card.find(card_name)
    price_data = card.tcgplayer.prices
    ungraded = price_data.normal

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

async def db_fetch_data_all_cards_in_set(set_name: str) -> dict:
    cards_in_set = cards_db.find({"set": set_name}).sort("number")
    cards = await cards_in_set.to_list(length=300)
    print(cards)
    output_dict = []
    for card in cards:
        combined_card_data = await db_combine_card_data_with_price(set_name, card)
        print(combined_card_data)
        output_dict.append(combined_card_data)
    return output_dict

    
async def db_combine_card_data_with_price(set_name: str, card_data: dict) -> dict:
    card_name = card_data.get("name", "")
    card_number = card_data.get("number", "")
    card_rarity = card_data.get("rarity", "")
    card_price = await db_fetch_price_single_card(set_name, card_name, card_number, card_rarity)
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
    print(card_set['rarities'])
    rarities = card_set['rarities']
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
    cards = await cursor.to_list(length=300)
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
        setCards = await get_cardset_cards(set_name)
        set_in_priceDB = await prices_db.find_one({"name": set_name})
        set_card_data = set_in_priceDB["cardPrices"]
        generation_name = await get_generation_from_set(set_name)
        for card in setCards:
            print("parsing card: " + str(card["name"]))
            if card["varients"] != []:
                # create obj to add to list for every varient
                for varient in card["varients"]:
                    card_price = get_price_charting_data(generation_name,set_name, card["name"], card["number"], varient)
                    card_object = {
                        "name": card["name"],
                        "number": card["number"],
                        "price": card_price,
                        "rarity": varient
                    }
                    if varient not in set_card_data:
                        set_card_data[varient] = {}
                    set_card_data[varient][card["name"]] = card_object
            
            


            card_price = get_price_charting_data(generation_name, set_name, card["name"], card["number"])
            card_object = {
                "name": card["name"],
                "number": card["number"],
                "price": card_price,
                "rarity": card.get("rarity", "No Rarity")
            }
            if card.get("rarity", "No Rarity") not in set_card_data:
                set_card_data[card["rarity"]] = {}
            set_card_data[card.get("rarity", "No Rarity")][card["name"]] = card_object
        await prices_db.update_one({"name": set_name}, {"$set": {"cardPrices": set_card_data}})
        return "Success"
    except:
        print("Error")
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

'''
async def resetRarityFor151():
    # Fetch the card document from the database
        card = await cards_db.find_one({"set": "151", "number": cardNumber})
        print(card)
        if card:
            print("Card found")
            # Extract the card ID
            card_id = card["id"]
            
            # Fetch the rarity from the external API
            apiCard = Card.find(card_id)
            new_rarity = apiCard.rarity
            print("updating now with new rarity: " + str(new_rarity))
            # Update the rarity in the database
            await cards_db.update_one(
                {"id": card_id},
                {"$set": {"rarity": new_rarity}}
            )
            
            print("Success")
        else:
            return "Card not found"
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Failed"
'''



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

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <set_name>")
        sys.exit(1)
    
    set_name = sys.argv[1]
    update_or_insert_set(set_name)

async def insertTracker(set_name: str):
    tracker_db.insert_one({"set": set_name})
    print(f"Inserted document")
    return "meow"

async def getTrackers():
    cursor = tracker_db.find({})
    output = []
    async for doc in cursor:
        output.append(doc["set"])
    return output
