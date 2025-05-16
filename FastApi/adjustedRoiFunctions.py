import databaseFunctions as db  # Your module for database functions
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util


# Initialize the SentenceTransformer model (a lightweight model for fast inference)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# -------------------------------------------------------------------
# Define reference texts for each dimension and precompute their embeddings
# -------------------------------------------------------------------

# Risk Tolerance Anchors
risk_tolerant_ref = (
    "I love the thrill of the unknown when opening packs. Even if I don’t pull anything valuable, it’s all part of the excitement. "
    "The chase itself is what keeps me going—I’ll open as many packs as it takes!"
)
risk_averse_ref = (
    "I prefer certainty. Instead of relying on chance, I stick to buying individual cards. It’s more practical and guarantees that I get exactly what I want."
)
risk_tolerant_embedding = embedding_model.encode(risk_tolerant_ref, convert_to_tensor=True)
risk_averse_embedding = embedding_model.encode(risk_averse_ref, convert_to_tensor=True)

# Emotional Attachment Anchors
emotional_high_ref = (
    "Opening packs is pure nostalgia. Every time I tear one open, I feel like a kid again. The excitement and joy I get from discovering what’s inside never gets old."
)
emotional_low_ref = (
    "Opening packs doesn’t mean much to me. I’d rather just buy the cards I want and enjoy a complete collection without all the guessing."
)
emotional_high_embedding = embedding_model.encode(emotional_high_ref, convert_to_tensor=True)
emotional_low_embedding = embedding_model.encode(emotional_low_ref, convert_to_tensor=True)

# Willingness to Spend Anchors
spending_high_ref = (
    "I’m happy to invest in my collection. If I see something I like, I don’t think twice about spending money on it. "
    "I’m always on the lookout for the next great card, no matter the cost."
    "I live to spend money on cards."
)
spending_low_ref = (
    "I keep a strict budget for my cards. I can’t afford to spend a lot, so I only make small, occasional purchases when it’s truly worthwhile."
)
spending_high_embedding = embedding_model.encode(spending_high_ref, convert_to_tensor=True)
spending_low_embedding = embedding_model.encode(spending_low_ref, convert_to_tensor=True)


# -------------------------------------------------------------------
# Pydantic model for incoming user data
# -------------------------------------------------------------------
class NLPData(BaseModel):
    answer1: str  # Used for assessing risk tolerance
    answer2: str  # Used for assessing emotional attachment
    answer3: str  # Used for assessing willingness to spend
    set_name: str

# -------------------------------------------------------------------
# Helper function: compute continuous score via cosine similarity
# -------------------------------------------------------------------
def compute_continuous_score(text: str, positive_embedding, negative_embedding) -> float:
    """
    Computes a continuous score between 0 and 1 by comparing the text embedding
    with precomputed positive and negative reference embeddings.
    
    A score near 1 indicates that the text is more similar to the positive anchor.
    A score near 0 indicates higher similarity to the negative anchor.
    """
    text_embedding = embedding_model.encode(text, convert_to_tensor=True)
    sim_positive = util.cos_sim(text_embedding, positive_embedding).item()
    sim_negative = util.cos_sim(text_embedding, negative_embedding).item()
    
    # Avoid division by zero with a small epsilon
    epsilon = 1e-8
    score = sim_positive / (sim_positive + sim_negative + epsilon)
    return score

# -------------------------------------------------------------------
# Functions to compute scores for each dimension
# -------------------------------------------------------------------
def compute_risk_tolerance(text: str) -> float:
    return compute_continuous_score(text, risk_tolerant_embedding, risk_averse_embedding)

def compute_emotional_attachment(text: str) -> float:
    return compute_continuous_score(text, emotional_high_embedding, emotional_low_embedding)

def compute_willingness_to_spend(text: str) -> float:
    return compute_continuous_score(text, spending_high_embedding, spending_low_embedding)

# -------------------------------------------------------------------
# Main function to calculate adjusted ROI
# -------------------------------------------------------------------
async def calculate_adjusted_roi(data: NLPData):
    # Compute normalized scores for each dimension from 0 to 1
    risk_tolerance = compute_risk_tolerance(data.answer1)
    emotional_attachment = compute_emotional_attachment(data.answer2)
    willingness_to_spend = compute_willingness_to_spend(data.answer3)
    set_name = data.set_name

    # Debug prints (can be removed or replaced with logging)
    print("Risk Tolerance:", risk_tolerance)
    print("Emotional Attachment:", emotional_attachment)
    print("Willingness to Spend:", willingness_to_spend)
    print("Set Name:", set_name)

    # Extract the trivial ROI (using a dummy value; in production, retrieve from your database)
    # trivial_roi = await db.get_trivial_roi("pack", set_name)
    trivial_roi = 16.42

    # Calculate the adjusted ROI. Here, as an example, we take the average multiplier.
    average_multiplier = (risk_tolerance + emotional_attachment + willingness_to_spend) / 3
    adjusted_roi = trivial_roi * average_multiplier

    return {
        "adjusted_roi": round(adjusted_roi, 2),
        "normalized_scores": {
            "risk_tolerance": risk_tolerance,
            "emotional_attachment": emotional_attachment,
            "willingness_to_spend": willingness_to_spend
        }
    }

# To run the API, use: uvicorn main:app --reload
