# This file contains the functions that interact with the database
# database_functions.py

from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection details
MONGO_DETAILS = #db string here
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["your_database_name"]
collection = database["your_collection_name"]

'''
=======================================================================================================
Get functions
=======================================================================================================
'''

def get_good_data(good: str, set: str) -> dict:
    """
    Get the data of the good from the database
    :param good: The name of the good
    :return: A dictionary with the data of the good
    """
    good_data = {}
    # Get the data of the good from the database
    return good_data

def get_single_card_price(set_name: str, card_name: str, card_number: str) -> dict:
    """
    Get the card prices from the database
    :param set_name: The name of the set
    :param card_name: The name of the card
    :param card_number: The number of the card
    :return: A dictionary with the card prices
    """
    card_prices = {}
    # Get the card prices from the database
    return card_prices

def get_set_card_prices(set_name: str, card_name: str, card_number: str) -> dict:
    """
    Get the card prices from the database
    :param set_name: The name of the set
    :param card_name: The name of the card
    :param card_number: The number of the card
    :return: A dictionary with the card prices
    """
    card_prices = {}
    # Get the card prices from the database

    return card_prices

def get_trivial_roi(good: str, set: str) -> dict:
    """
    Get the trivial ROI of the good from the database
    :param good: The name of the good
    :return: A dictionary with the trivial ROI of the good
    """
    trivial_roi = {}
    # Get the trivial ROI of the good from the database
    return trivial_roi

def get_pullrates(rarity: str, set: str) -> dict:
    """
    Get the pullrates of the good from the database
    :param good: The name of the good
    :return: A dictionary with the pullrates of the good
    """
    pullrates = {}
    # Get the pullrates of the good from the database
    return pullrates

'''
Post functions
'''


'''
Update functions
'''