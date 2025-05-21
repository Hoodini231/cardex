import os
import logging

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pokemontcgsdk import Card,Set,RestClient
from models import CardModel, CardSetModel, CardGenModel

# init a load dotenv
load_dotenv()

# MongoDB connection
MONGO_DETAILS = os.getenv("DATABASE_STRING")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["test"]
cards_db = database["cards"]
cardsets_db = database["cardsets"]
cardgens_db = database["cardgens"]

# Pokemon TCG API connection
POKEMON_TCG_API_KEY = os.getenv("POKEMON_TCG_API_KEY")
RestClient.configure(POKEMON_TCG_API_KEY)

# Init constants
NEW_SET = True
NEW_GENERATION = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(levelname)s - %(message)s",  # Define the log format
    handlers=[
        logging.StreamHandler()  # Output logs to the console
    ]
)

'''
API Higherlevel function to update database with new set and/or generation
'''
async def db_fetch_update_info() -> dict:
    logging.info("db_fetch_update_info >>> Start")
    databaseLatestCardSetAndGeneration = await db_fetch_latest_knownSetAndGeneration()
    latestSetListFromAPI = pkmonSdkRetrieveSets(databaseLatestCardSetAndGeneration["latestCardSetReleaseDate"])
    if len(latestSetListFromAPI) == 0:
        logging.info("db_fetch_update_info >>> No new set or generation found")
        return # Early exit 
    
    # Highly unlikely more than one set is released at the same day - Procaution just in case
    for pokemonSet in latestSetListFromAPI:
        await determineNewSetOrGeneration(pokemonSet, databaseLatestCardSetAndGeneration["latestGeneration"])

'''Seralize documents retrieved from MongoDB'''
def serialize_document(card: dict) -> dict:
    if card is not None:
        # Convert the ObjectId to a string.
        if "_id" in card:
            card["_id"] = str(card["_id"])
    return card

'''Retrieves latest known set and generation from MongoDB'''
async def db_fetch_latest_knownSetAndGeneration():
    logging.info("db_fetch_latest_knownSetAndGeneration >>> Start")
    doc = await cardsets_db.find_one(sort=[("releaseDate", -1)])
    logging.info("db_fetch_latest_knownSetAndGeneration >>> Found latest card set data: %s", doc)
    jsonObj = serialize_document(doc)
    latestInformationJson = {}
    latestInformationJson["latestCardSet"] = jsonObj["name"]
    latestInformationJson["latestCardSetReleaseDate"] = jsonObj["releaseDate"]
    latestInformationJson["latestGeneration"] = jsonObj["series"]
    logging.info("db_fetch_latest_knownSetAndGeneration >>> Latest card set data returned: %s", latestInformationJson)
    return latestInformationJson


''' Retrieve a list of cardsets released at the same time or aftter the latest known set from extneral API '''
def pkmonSdkRetrieveSets(LatestKnownGenerationYear: str):
    logging.info("pkmonSdkRetrieveSets >>> Start")
    sets = Set.all()
    logging.info("pkemon SDK API >>> Successful call to retrieve sets")
    # Filter sets by latest known set to retrieve only latest generation or new sets/generations
    print(LatestKnownGenerationYear)
    filteredSetList = list(filter(lambda x: x.releaseDate >  LatestKnownGenerationYear, sets))
    logging.info("pkmon SDK API >>> Filtered set list: %s", filteredSetList)
    return filteredSetList

'''
Determines if there is a new set and/or generation to be inserted in the database
'''
async def determineNewSetOrGeneration(latestSet: Set, latestKnownGen: str) -> bool:
    logging.info("determineNewSetOrGeneration >>> Start")
    if latestSet.series != latestKnownGen:
        # If its a new generation, it is also a new set
        logging.info("determineNewSetOrGeneration >>> New generation found: %s", latestSet.series)
        await insertNewGeneration(latestSet.series)

    else:
        logging.info("determineNewSetOrGeneration >>> New set found: %s", latestSet.name)
        await insertNewSet(latestSet)

'''
Inserts new generation into the cardgens database then calls insertNewSet
'''
async def insertNewGeneration(generation: str, latestSet: Set):
    logging.info("insertNewGeneration >>> Start")
    # Grab new generation from the new set using external API
    releaseYear = latestSet.releaseDate[:4]
    cardGen = CardGenModel(
        name=generation,
        series=[{
            "id": latestSet.id,
            "name": latestSet.name
        }],
        created=releaseYear
    )
    cardGen_dict = cardGen.model_dump()
    logging.info("insertNewGeneration >>> Inserting new generation into the database: %s", cardGen_dict)
    await cardgens_db.insert_one(cardGen_dict)
    logging.info("insertNewGeneration >>> Insertion successful")
    # Call insertNewSet to insert new set
    await insertNewSet(latestSet)

'''
Inserts new set into the cardsets database and inserts all cards from the new set'''    
async def insertNewSet(latestSet: Set):
    logging.info("insertNewSet >>> Start")
    # Convert the Legality object to a dictionary
    legalities_dict = vars(latestSet.legalities) if latestSet.legalities else None

    dataToInsert = CardSetModel(
        id=latestSet.id,
        name=latestSet.name,
        series=latestSet.series,
        printedTotal=latestSet.printedTotal,
        total=latestSet.total,
        legalities=legalities_dict,
        ptcgoCode=latestSet.ptcgoCode,
        releaseDate=latestSet.releaseDate,
        updatedAt=latestSet.updatedAt,
        images={
            "symbol": latestSet.images.symbol
        }
    )
    data_dict = dataToInsert.model_dump()
    logging.info("insertNewSet >>> Inserting new set into the database: %s", data_dict)
    result = await cardsets_db.insert_one(data_dict)
    logging.info("insertNewSet >>> Insertion successful")
    await insertNewSetCards(latestSet.id, latestSet.total)

'''
Inserts new cards from new set into the cards database
'''
async def insertNewSetCards(setId: str, setTotal: int):
    logging.info("insertNewSetCards >>> Start")

    # API end point for specific queries is broken...
    for cardNumber in range(1,setTotal+1):
        currentCard = Card.find(f'{setId}-{cardNumber}')

        attacks = [
            {
                "name": attack.name,
                "cost": list(attack.cost),  # Convert list to string
                "convertedEnergyCost": str(attack.convertedEnergyCost) if attack.convertedEnergyCost is not None else None,
                "damage": attack.damage,
                "text": attack.text,
            }
            for attack in currentCard.attacks
        ] if currentCard.attacks else []

        # Convert weaknesses to a list of dictionaries
        weaknesses = [
            {
                "type": weakness.type,
                "value": weakness.value,
            }
            for weakness in currentCard.weaknesses
        ] if currentCard.weaknesses else []

        abilities = [
            {
                "name": ability.name,
                "text": ability.text,
                "type": ability.type,
            }
            for ability in currentCard.abilities
        ]   if currentCard.abilities else []

        legalities = vars(currentCard.legalities) if currentCard.legalities else None

        CardData = CardModel(
            id=currentCard.id,
            name=currentCard.name,
            supertype=currentCard.supertype,
            subtypes=currentCard.subtypes,
            hp=currentCard.hp,
            types=currentCard.types,
            evolvesFrom=currentCard.evolvesFrom,
            abilities=abilities,
            attacks=attacks,
            weaknesses=weaknesses,
            retreatCost=currentCard.retreatCost,
            convertedRetreatCost=currentCard.convertedRetreatCost,
            set={
                "id": currentCard.set.id,
                "name": currentCard.set.name
            },
            number=currentCard.number,
            artist=currentCard.artist,
            rarity=currentCard.rarity,
            flavorText=currentCard.flavorText,
            nationalPokedexNumbers=currentCard.nationalPokedexNumbers,
            legalities=legalities,
            imageLarge=currentCard.images.large,
            imageSmall=currentCard.images.small
        )
        currentCard_dict = CardData.model_dump()
        logging.info("insertNewSetCards >>> Inserting new card into the database: %s", currentCard_dict)
        await cards_db.insert_one(currentCard_dict)
        logging.info("insertNewSetCards >>> Insertion successful")
