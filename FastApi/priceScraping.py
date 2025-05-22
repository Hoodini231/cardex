import requests, logging
from selenium import webdriver
from selenium.webdriver.common.by import By
import time, re
import pandas as pd
from bs4 import BeautifulSoup as bs4
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from motor.motor_asyncio import AsyncIOMotorClient


options = webdriver.ChromeOptions()
options.add_argument("--headless")
SCROLL_PAUSE_TIME = 1.5

# Price Charting webpage
PRICE_CHARTING_CARD_URL = "https://www.pricecharting.com/game/pokemon-"
PRICE_CHARTING_SET_URL = "https://www.pricecharting.com/console/pokemon-"

# TCG Player

#Collectr


MONGO_DETAILS = os.getenv("DATABASE_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["test"]
prices_db = database["prices"]
products_db = database["products"]
cards_db = database["cards"]
cardsets_db = database["cardsets"]

'''
Normalizes a string by replacing spaces with dashes for url's
@param text: the text to normalize
@return: the normalized text
'''
def normalizeString(text: str) -> str:
    return text.replace(" ", "-")

'''
webscrapes price data from price charting
@param set_name: the name of the set to scrape
@return: a dictionary containing the data
'''
def get_price_charting_data(generation_name: str, set_name: str, card_name: str, card_number: str, varient_name: str = ""):
    normalized_generation_name = normalizeString(generation_name)
    normalized_set_name = normalizeString(set_name)
    normalized_card_name = normalizeString(card_name)
    # Append varient name if it exists
    if varient_name != "":
        normalized_card_name += "-" + normalizeString(varient_name)
    
    card_price_charting_data = {}

    heuristics = [
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_set_name}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_set_name}/{normalized_card_name.replace('é','e')}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_set_name}/{normalized_card_name.replace('.','')}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{'promo'}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_set_name.replace('vs','&')}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_generation_name}-{normalized_set_name}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_generation_name.replace('and', '&')}-{normalized_set_name}/{normalized_card_name}-{card_number}",
    ]
    tableFound = False
    # hit heuristics until valid data
    for build_url in heuristics:
        try:
            if tableFound == True:
                break
            url = build_url()
            print(url)
            response = requests.get(url)
            soup = bs4(response.content, "html.parser")
            div = soup.find("div", id="full-prices")
            if div:
                table = div.find("table")
                if table:
                    rows = table.find_all("tr")
                    for row in rows:
                        columns = row.find_all("td")
                        # Each row should be a grade and price
                        if columns and len(columns) >= 2:
                            grade = columns[0].text.strip()
                            price = columns[1].text.strip()
                            card_price_charting_data[grade] = price
                            if tableFound == False:
                                tableFound = True
            else:
                print("Table not found ->>>  activating alt page scrape")
                card_price_charting_data = alt_page_scrape(url, card_name, varient_name)
                if card_price_charting_data != {}:
                    break
        except:
            try:
                # Self-heal approach should url fail and redirect to alt page
                print("meow >>> activating alt page scrape")
                card_price_charting_data = alt_page_scrape(url, card_name, varient_name)
            except:
                logging.error(f"Error:")
            
    return card_price_charting_data

async def alt_page_scrape(url, card_name, varient: str):
    '''
    This function is part of a self-heal where if URL leads to a alternative table page, it will scrape the data from that page
    '''
    try:
        response = requests.get(url)
        soup = bs4(response.content, "html.parser")
        divs = soup.find("div", id="content")
        sr = divs.find("div", id="search-results")
        data = []
        if sr:
            x = sr.find("table")
            rows = x.find_all("tr")
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 4:
                    res = handle_PC_alternative_table_scraped_name(cols[1].text, card_name, varient)
                    print(res)
                    return res
                    
    except:
        logging.error(f"Error: {e}")
        
    return 'duc'

def handle_PC_alternative_table_scraped_name(scraped_name: str, card_name: str, varient: str):
    if varient != '':
        if varient in scraped_name:
            return direct_scrape_no_heal(scraped_name)
            
    else:
        return direct_scrape_no_heal(scraped_name)
    

def direct_scrape_no_heal(url: str):
    response = requests.get(url)
    soup = bs4(response.content, "html.parser")
    div = soup.find("div", id="full-prices")
    if div:
        table = div.find("table")
        if table:
            rows = table.find_all("tr")
            for row in rows:
                columns = row.find_all("td")
                # Each row should be a grade and price
                if columns and len(columns) >= 2:
                    grade = columns[0].text.strip()
                    price = columns[1].text.strip()
                    card_price_charting_data[grade] = price
    return card_price_charting_data
'''
==========================================
Web scraping functions to augemnt datasets
==========================================
'''
# need to generalize this as only created for one set
'''
Augments the rarity data for a given set
@param set_name: the name of the set to augment
@return: a dictionary containing the data
'''
async def augment_rarity_data(set_name: str) -> dict:
    try:
        logging.info(f"Augmenting rarity data for set: {set_name}")
        nameList = scrape_all_names_from_set(set_name)
        for name in nameList:
            if "[Reverse Holo]" in name:
                number = re.search(r"#\s*(\d+)", name).group(1)
                await updateRarity("Reverse Holo",set_name, number)
            elif "[Cosmos Holo]" in name:
                number = re.search(r"#\s*(\d+)", name).group(1)
                await updateRarity("Cosmos Holo",set_name, number)
            elif "[Poke Ball]" in name:
                number = re.search(r"#\s*(\d+)", name).group(1)
                await updateRarity("Poke Ball",set_name, number)
            elif "[Master Ball]" in name:
                number = re.search(r"#\s*(\d+)", name).group(1)
                await updateRarity("Master Ball",set_name, number)
    except:
        return {"data": "Error augmenting rarity data"}

    return {"data": nameList}
'''
Scrapes all card names from a set on price charting
@param set_name: the name of the set to scrape
@return: a list of card names
'''
def scrape_all_names_from_set(set_name: str) -> list:
    table_data = autoscroll_pageation(set_name)
    soup = bs4(table_data, "html.parser")
    body = soup.find("tbody")
    output = []
    try:
        for row in body.find_all("tr"):
            columns = row.find_all("td")
            card_name = columns[1].text
            if card_name:
                output.append(card_name.strip())
        return output
    except Exception as e:
        print("Error: ", e)
        return []

'''
Loads the entire data set to bypass pagination via selenium
@param set_name: the name of the set to scrape
@return: the html of the table element
'''
def autoscroll_pageation(set_name: str) -> str:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=options)
    SCROLL_PAUSE_TIME = 2.5
    set_name = set_name.replace(" ", "-")
    print(f"{PRICE_CHARTING_SET_URL}{set_name}")
    driver.get(f"{PRICE_CHARTING_SET_URL}{set_name}")
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    logging.info(f"Last height: {last_height}")
    
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        new_height = driver.execute_script("return document.body.scrollHeight")
        print(f"Scrolled to new height: {new_height}")
        if new_height == last_height:
            break
        last_height = new_height
    
    try:
        # Wait for the table element to be present (up to 10 seconds)
        wait = WebDriverWait(driver, 5)
        table = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
        table_html = table.get_attribute('outerHTML')
        logging.info(f"{set_name} >>> Table element found.")
    except Exception as e:
        print("Error: Table element not found.", e)
        table_html = ""
    finally:
        driver.quit()
    return table_html



async def updateRarity(newRarity: str, setName: str,  cardNumber: str):
    oldCardObject = await cards_db.find_one({"set": setName, "number": cardNumber})
    varients = oldCardObject["varients"]
    print(varients)
    varients.append(newRarity)
    print(varients)
    await cards_db.update_one({"set": setName, "number": cardNumber}, {"$set": {"varients": varients}})
    print("updated")


async def tcg_player_price_import(card_name: str, set_name: str, generation: str):
    normalized_generation_name = normalizeString(generation_name)
    normalized_set_name = normalizeString(set_name)
    normalized_card_name = normalizeString(card_name)
    tcg_url = f"{normalized_set_name}/{normalized_card_name}"
    response = requests.get(url)
    soup = bs4(response.content, "html.parser")
    div = soup.find("div", id="full-prices")


