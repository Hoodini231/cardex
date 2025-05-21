from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class Ability(BaseModel):
    name: str
    text: Optional[str] = None
    type: Optional[str] = None


class Attack(BaseModel):
    name: str
    cost: Optional[List[str]] = None
    convertedEnergyCost: Optional[int] = None
    damage: Optional[str] = None
    text: Optional[str] = None


class Weakness(BaseModel):
    type: Optional[str] = None
    value: Optional[str] = None


class Legalities(BaseModel):
    unlimited: Optional[str] = None
    standard: Optional[str] = None
    expanded: Optional[str] = None

class CardModel(BaseModel):
    id: str
    name: str
    supertype: str
    subtypes: Optional[List[str]]
    hp: Optional[str]
    types: Optional[List[str]]
    evolvesFrom: Optional[str]
    abilities: Optional[List[Dict[str, str]]]
    attacks: Optional[List[Attack]]  # List of dictionaries for attacks
    weaknesses: Optional[List[Weakness]]  # List of dictionaries for weaknesses
    retreatCost: Optional[List[str]]
    convertedRetreatCost: Optional[int]
    set: str  # Expecting a string (e.g., set ID or name)
    number: str
    artist: Optional[str]
    rarity: Optional[str]
    flavorText: Optional[str]
    nationalPokedexNumbers: Optional[List[int]]
    legalities: Optional[Dict[str, str]]
    imageLarge: Optional[str]
    imageSmall: Optional[str]

    class Config:
        orm_mode = True
        extra = "ignore"
