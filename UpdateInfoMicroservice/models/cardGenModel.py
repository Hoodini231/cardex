from typing import List
from pydantic import BaseModel, Field


class SeriesItem(BaseModel):
    id: str = Field(..., description="Series ID")
    name: str = Field(..., description="Series name")


class CardGenModel(BaseModel):
    name: str = Field(..., description="CardGen name")
    series: List[SeriesItem] = Field(..., description="List of series")

    class Config:
        orm_mode = True
        extra = "ignore"
