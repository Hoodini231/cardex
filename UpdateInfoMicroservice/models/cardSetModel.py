from typing import Optional
from pydantic import BaseModel, Field


class Legalities(BaseModel):
    unlimited: Optional[str] = None
    standard: Optional[str] = None
    expanded: Optional[str] = None


class Images(BaseModel):
    symbol: Optional[str] = None


class CardSetModel(BaseModel):
    id: str = Field(..., description="Unique ID of the card set")
    name: str = Field(..., description="Name of the card set")
    series: Optional[str] = None
    printedTotal: Optional[int] = None
    total: Optional[int] = None
    legalities: Optional[Legalities] = None
    ptcgoCode: Optional[str] = None
    releaseDate: Optional[str] = None
    updatedAt: Optional[str] = None
    images: Optional[Images] = None

    class Config:
        orm_mode = True
        extra = "ignore"
