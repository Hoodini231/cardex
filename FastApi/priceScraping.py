import requests
import pandas as pd
from bs4 import BeautifulSoup as bs4

# Price Charting webpage
PRICE_CHARTING_URL = "https://www.pricecharting.com/game/pokemon-"

# TCG Player

#Collectr


def get_price_charting_data(set_name: str, card_name: str, card_number: str) -> dict:
    """
    Get the price charting data for the given game name
    :param game_name: The name of the game
    :return: A dictionary with the price charting data
    """
    set_name = set_name.replace(' ', '-')
    card_name = card_name.replace(' ', '-')

    card_price_charting_data = {}

    response = requests.get(f"{PRICE_CHARTING_URL}{set_name}/{card_name}-{card_number}")
    soup = bs4(response.content, "html.parser")
    div = soup.find("div", id="full-prices")
    if div:
        table = div.find("table")
        rows = table.find_all("tr")
        for row in rows:
            columns = row.find_all("td")
            if columns:
                grade = columns[0].text
                price = columns[1].text
                card_price_charting_data[grade] = price
    
    return card_price_charting_data
    

obj = get_price_charting_data("Stellar Crown","Terapagos ex", "170")


