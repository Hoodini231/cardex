# This file contains the functions that interact with the database
# database_functions.py
import os

from dotenv import load_dotenv
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from pokemontcgsdk import Card
from priceScraping import get_price_charting_data

# MongoDB connection details
MONGO_DETAILS = os.getenv("DATABASE_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["test"]
prices_db = database["prices"]
products_db = database["products"]
cards_db = database["cards"]
cardsets_db = database["cardsets"]
'''
=======================================================================================================
Get functions
=======================================================================================================
'''
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

def get_trivial_roi(good: str, set: str) -> dict:
    trivial_roi = {}
    # Get the trivial ROI of the good from the database
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
            price_str = card_info["price"]["Ungraded"].replace('$', '')
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
    setCards = await get_cardset_cards(set_name)
    set_in_priceDB = await prices_db.find_one({"name": set_name})
    set_card_data = set_in_priceDB["cardPrices"]
    for card in setCards:
        print("parsing card: " + str(card["name"]))
        if card["varients"] != []:
            # create obj to add to list for every varient
            for varient in card["varients"]:
                card_price = get_price_charting_data("scarlet-&-violet-151", card["name"], card["number"], varient)
                card_object = {
                    "name": card["name"],
                    "number": card["number"],
                    "price": card_price,
                    "rarity": varient
                }
                if varient not in set_card_data:
                    set_card_data[varient] = {}
                set_card_data[varient][card["name"]] = card_object

        card_price = get_price_charting_data("scarlet-&-violet-151", card["name"], card["number"])
        card_object = {
            "name": card["name"],
            "number": card["number"],
            "price": card_price,
            "rarity": varient
        }
        if card["rarity"] not in set_card_data:
            set_card_data[card["rarity"]] = {}
        set_card_data[card["rarity"]][card["name"]] = card_object
    await prices_db.update_one({"name": set_name}, {"$set": {"cardPrices": set_card_data}})
    return "Success"

'''
Updates the varients for test set 151
'''
async def updateRarity(newRarity: str, setName: str,  cardNumber: str):
    oldCardObject = await cards_db.find_one({"set": "151", "number": cardNumber})
    varients = oldCardObject["varients"]
    print(varients)
    varients.append(newRarity)
    print(varients)
    await cards_db.update_one({"set": "151", "number": cardNumber}, {"$set": {"varients": varients}})
    print("updated")

    
'''
Problem: data inconsistency and not prepped
solution: use webscrapping to update the rarity of reverse holos via price charting
process: go to the web page, download all the card names then find any cards containing reverse holo or holo or cosmos holo or 
'''

async def updateVarients():
    print("updating varients")
    cards_db.update_many({"set": "151"}, {"$set": {"varients": []}})

async def resetRarityFor151():
    try:
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
        

