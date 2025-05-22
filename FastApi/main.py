import logging
from typing import Optional, List

from pydantic import BaseModel
from fastapi import FastAPI, Query
from priceScraping import get_price_charting_data, augment_rarity_data
from fastapi.middleware.cors import CORSMiddleware
from trivialRoiFunctions import calculate_trivial_pack_expected_value
from databaseFunctions import db_fetch_set_roipage, db_fetch_set_rarities, db_fetch_all_cardgens, db_fetch_data_all_cards_in_set, db_fetch_data_single_card, db_fetch_price_single_card, db_fetch_combined_card_data, db_fetch_price_single_card, get_cardset_data, get_cardset_cards, updateVarients, import_set_card_prices, get_generation_from_set, fix_rarity_db, fix_products_db, get_all_cardsets, fix_shit, insertTracker, getTrackers
from breakdown import calculateBreakdown
import json
from bson import ObjectId

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

app = FastAPI()
app.json_encoder = CustomJSONEncoder

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

class nlpData(BaseModel):
    
    answer1: str
    answer2: str
    answer3: str
    set_name: str

'''
========================================================================================
FETCH CALLS
========================================================================================
'''
'''
@app.get("/cardprice/{set_name}/{card_name}/{card_number}")
async def read_card_price(set_name: str, card_name: str, card_number: str):
    logging.info(f"Getting card price start >>> {set_name}| {card_name} | {card_number}")
    generation = await get_generation_from_set(set_name)
    result = get_price_charting_data(generation, set_name, card_name, card_number)
    return {"data": result}
'''
#================================================================================================
@app.get("/get/price/card/{set_name}/{card_name}/{card_number}")
async def read_get_price_single_card(set_name: str, card_name: str, card_number: str):
    return await db_fetch_price_single_card(set_name, card_name, card_number, '')

@app.get("/get/data/card/{set_name}/{card_name}/{card_number}")
async def read_get_card_data(set_name: str, card_name: str, card_number: str):
    return await db_fetch_combined_card_data(set_name, card_name, card_number)

@app.get("/get/render/collections/{set_name}")
async def read_get_render_collections(
    set_name: str, 
    page: int = Query(1, ge=1),
    pageSize: int = Query(60, ge=1, le=300),
    rarity: Optional[str] = None,
    types: Optional[List[str]] = Query(None),
    supertype: Optional[str] = None,
    name: Optional[str] = None,
    sort_by: Optional[str] = Query("number", description="Field to sort by"),
    sort_order: Optional[int] = Query(1, description="Sort order: 1 for ascending, -1 for descending")
    ):
        # Create a filters dictionary with the provided query parameters
        filters = {}
        if rarity:
            filters["rarity"] = rarity
        if types:
            filters["types"] = {"$in": types}
        if supertype:
            filters["supertype"] = supertype
        if name:
            filters["name"] = {"$regex": name, "$options": "i"}  # Case-insensitive search
        
        # Call the database function with filters
        return await db_fetch_data_all_cards_in_set(
            set_name=set_name, 
            page=page, 
            page_size=pageSize,
            filters=filters,
            sort_by=sort_by,
            sort_order=sort_order
    )

@app.get("/get/collections")
async def read_get_collections():
    return await db_fetch_all_cardgens()

@app.get("/get/set/rarities/{set_name}")
async def read_get_set_rarities(set_name: str):
    return await db_fetch_set_rarities(set_name)
#================================================================================================
@app.get("/get/price/set/{set_name}")
def read_get_price_set(set_name: str):
    return db_fetch_price_set(set_name)

@app.get("/get/render/collections/{set_name}")
def read_get_render_collections(set_name: str):
    return db_fetch_render_collections(set_name)

@app.get("/get/render/roi/setlist")
async def read_get_render_roi_setlist():
    return await db_fetch_set_roipage()

@app.get("/get/trivialROI/{set_name}")
async def read_trivial_roi(set_name: str):
    return await calculate_trivial_pack_expected_value(set_name)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get/calculateBreakdown/{set_name}")
async def read_calculated_breakdown(set_name: str):
    return await calculateBreakdown(set_name)


'''
========================================================================================
POST CALLS: CREATE, UPDATE, DELETE
========================================================================================
'''
@app.post("/roi/calculateAdjustedROI")
async def read_calculate_adjusted_roi(request: nlpData):
    data = request
    return await calculate_adjusted_roi(data)






'''
========================================================================================
SCHEMA UPDATE API FUNCTION CALLS
========================================================================================
'''








'''
========================================================================================
ONE TIME DATA MANIPULATION FIX FUNCTIONS
========================================================================================
'''
@app.get("/insert/tracker")
async def insert_tracker():
    return await insertTracker()

@app.get('/test/scrape')
async def test_scrape():
    return get_price_charting_data("Scarlet & Violet", "151", "Charizard ex", "199", "")

@app.get("/fixrarity")
async def fix_rarity():
    return await fix_rarity_db()

@app.get("/insert/Varients/{set_name}")
async def insert_varients(set_name: str):
    await updateVarients(set_name)
    return "Success"

@app.get("/import/sets/toPrice")
async def read_setsImport():
    msg = await i


@app.get("/fixProducts/{set_name}")
async def read_fix_products(set_name: str):
    fix_products_db(set_name)
    return "meow"

@app.get("/fix/set/prices/{set_name}")
async def read_fix_set_prices(set_name: str):
    return await import_set_card_prices(set_name)

@app.get("/fix/set/rarities/{set_name}")
async def read_fix_set_rarities(set_name: str):
    return await augment_rarity_data(set_name)

@app.get("/fix/all/sets/prices")
async def read_fix_all_sets_prices():
    try:
        sets = get_all_cardsets()
        tracker = await getTrackers()
        output = []
        async for set in sets:
            if set['name'] in tracker:
                print("passing: ", set["name"])
                continue
            elif set["series"] in ['Black & White', 'Base', 'Diamond & Pearl']:
                await updateVarients(set["name"])
                print(f"Varients added to set: {set['name']}")
                await augment_rarity_data(set["name"])
                print(f"New Rarities added to varients int set: {set['name']}")
                await import_set_card_prices(set["name"])
                await insertTracker(set['name'])
                print(f"Prices added to set: {set['name']}")
                output.append(set["name"])
        await sets.close()
        return output
    except CursorNotFound as e:
        read_fix_all_sets_prices()
@app.get("/fix/poor/set/{set_name}")
async def read_fix_poorf(set_name: str):
    cards = await get_cardset_cards(set_name)
    for card in cards:
        if "Common" in card["rarity"] or "Uncommon" in card["rarity"]:
            await fix_shit(card['id'])
@app.get("/t")
async def r_t():
    return await getTrackers()
@app.get("/fix/poor/{set_name}")
async def read_fix_poorf(set_name: str):
    cards = await get_cardset_cards(set_name)
    return await fix_shit('sv8pt5-20')
'''
========================================================================================
TEST API CALLS
========================================================================================
'''


@app.get("/test/grabPrices/151")
async def read_grabPrices_set():
    return await import_set_card_prices("151")

@app.get("/test/151")
async def read_test_151():
    return await calculate_trivial_pack_expected_value("151")

@app.get("/test/setROI/{set_name}")
async def read_set_roi(set_name: str):
    return await calculate_trivial_pack_expected_value(set_name)


