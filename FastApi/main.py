import logging

from fastapi import FastAPI, Query
from priceScraping import get_price_charting_data, price_scrape
from fastapi.middleware.cors import CORSMiddleware
from trivialRoiFunctions import calculate_trivial_pack_expected_value
from databaseFunctions import get_cardset_data, get_cardset_cards, updateVarients, import_set_card_prices


app = FastAPI()

# Define the origins that are allowed to make requests.
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allows only the specified origins
    allow_credentials=True,
    allow_methods=["*"],        # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # Allows all headers
)
@app.get("/cardprice/updateAllPrices")

@app.get("/cardprice/{set_name}/{card_name}/{card_number}")
def read_card_price(set_name: str, card_name: str, card_number: str):
    print("hello")
    result = get_price_charting_data(set_name, card_name, card_number)
    return {"data": result}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/test/151")
async def read_test_151():
    return await calculate_trivial_pack_expected_value("151")


@app.get("/test/{set_name}")
async def read_set(set_name: str):
    return await price_scrape(set_name)

@app.get("/insert/Varients")
async def insert_varients():
    await updateVarients()
    return "Success"

@app.get("/import/sets/toPrice")
async def read_setsImport():
    msg = await importSetsToPrice()
    return msg

@app.get("/test/grabPrices/151")
async def read_grabPrices_set():
    return await import_set_card_prices("151")
