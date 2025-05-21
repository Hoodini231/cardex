import json
import logging

from bson import ObjectId
from fastapi import FastAPI
from DBFunctions import db_fetch_update_info

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

# Single API point - generic update to import new cards / sets
@app.get("/get/updateInfo")
async def read_update_info():
    logging.info("/get/updateInfo fetch request >>> Start")
    return await db_fetch_update_info()