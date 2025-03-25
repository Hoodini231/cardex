import requests, logging
from selenium import webdriver
from selenium.webdriver.common.by import By
import time, re
import pandas as pd
from bs4 import BeautifulSoup as bs4
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)
SCROLL_PAUSE_TIME = 1.5

# Price Charting webpage
PRICE_CHARTING_CARD_URL = "https://www.pricecharting.com/game/pokemon-"
PRICE_CHARTING_SET_URL = "https://www.pricecharting.com/console/pokemon-"

# TCG Player

#Collectr

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
def get_price_charting_data(generation_name: str, set_name: str, card_name: str, card_number: str, varient_name: str = "") -> dict:
    normalized_generation_name = normalizeString(generation_name)
    normalized_set_name = normalizeString(set_name)
    normalized_card_name = normalizeString(card_name)
    # Append varient name if it exists
    if varient_name != "":
        normalized_card += "-" + normalizeString(varient_name)
    
    card_price_charting_data = {}

    heuristics = [
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_set_name}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_generation_name}-{normalized_set_name}/{normalized_card_name}-{card_number}",
        lambda: f"{PRICE_CHARTING_CARD_URL}{normalized_generation_name.replace("and", "&")}-{normalized_set_name}/{normalized_card_name}-{card_number}",
    ]
    tableFound = False
    # hit heuristics until valid data
    for build_url in heuristics:
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
    logging.info(f"Augmenting rarity data for set: {set_name}")
    nameList = scrape_all_names_from_set(set_name)
    for name in nameList:
        if "Reverse Holo" in name:
            number = re.search(r"#\s*(\d+)", name).group(1)
            await updateRarity("Reverse Holo",set_name, number)
        elif "Cosmos" in name:
            number = re.search(r"#\s*(\d+)", name).group(1)
            await updateRarity("Cosmos Holo",set_name, number)
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
    for row in body.find_all("tr"):
        columns = row.find_all("td")
        card_name = columns[1].text
        if card_name:
            output.append(card_name.strip())
    return output

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

