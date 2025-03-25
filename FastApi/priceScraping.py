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
def urlHeal():
    # use heal to swap attempt using the generation with set name to get data
    pass
def get_price_charting_data(set_name: str, card_name: str, card_number: str, varient_name: str = "") -> dict:

    set_name = set_name.replace(' ', '-')
    card_name = card_name.replace(' ', '-')
    if varient_name != "":
        varient_name = varient_name.replace(' ', '-')
        card_name = card_name + "-" + varient_name
    
    card_price_charting_data = {}

    response = requests.get(f"{PRICE_CHARTING_CARD_URL}{set_name}/{card_name}-{card_number}")
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


def autoscroll_pageation(set_name: str) -> str:
    options = webdriver.ChromeOptions()
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=options)
    SCROLL_PAUSE_TIME = 5
    driver.get(f"{PRICE_CHARTING_SET_URL}{set_name}")
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    print("Scrolling...")
    
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        new_height = driver.execute_script("return document.body.scrollHeight")
        print(f"Scrolled to new height: {new_height}")
        if new_height == last_height:
            break
        last_height = new_height
        
    print("Done scrolling")
    
    try:
        # Wait for the table element to be present (up to 10 seconds)
        wait = WebDriverWait(driver, 10)
        table = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
        table_html = table.get_attribute('outerHTML')
    except Exception as e:
        print("Error: Table element not found.", e)
        table_html = ""
    finally:
        driver.quit()
    
    return table_html

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

# need to generalize this 
async def price_scrape(set_name: str) -> dict:
    print("Scraping prices")
    nameList = scrape_all_names_from_set(set_name)
    for name in nameList:
        if "Reverse Holo" in name:
            number = re.search(r"#\s*(\d+)", name).group(1)
            await updateRarity("Reverse Holo",set_name, number)
        elif "Cosmos" in name:

            number = re.search(r"#\s*(\d+)", name).group(1)
            await updateRarity("Cosmos Holo",set_name, number)
    
    return {"data": nameList}

