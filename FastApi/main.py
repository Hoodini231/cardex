from fastapi import FastAPI, Query
from priceScraping import get_price_charting_data
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/cardprice/{set_name}/{card_name}/{card_number}")
def read_card_price(set_name: str, card_name: str, card_number: str, q: str = Query(None, max_length=100)):
    print("hello")
    result = get_price_charting_data(set_name, card_name, card_number)
    return {"data": result, "query": q}

@app.get("/")
def read_root():
    return {"Hello": "World"}