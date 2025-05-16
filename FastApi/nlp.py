from pydantic import BaseModel
from transformers import pipeline

# Using distilbert for fast inference
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Pydantic model for incoming user data
class UserInput(BaseModel):
    answer1: str  # Emotional Attachment
    answer2: str  # Risk Tolerance
    answer3: str  # Willingness to Spend

def get_numeric_sentiment(text: str) -> float:
    """
    Process the input text with a sentiment analysis pipeline.
    Maps "POSITIVE" to a positive score and "NEGATIVE" to a negative score.
    """
    result = sentiment_pipeline(text)[0]
    # Convert result to a numeric score: positive score for "POSITIVE", negative for "NEGATIVE"
    score = result["score"] if result["label"] == "POSITIVE" else -result["score"]
    return score