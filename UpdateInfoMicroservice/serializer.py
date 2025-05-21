from bson import ObjectId

def serialize_cardgen(doc: dict) -> dict:
    """
    Serializes a single CardGen document.
    Converts the MongoDB ObjectId (if present) and processes the nested 'series' list.
    """
    serialized = {}
    # Convert the top-level _id to a string if it exists.
    if "_id" in doc:
        serialized["id"] = str(doc["_id"])
    else:
        serialized["id"] = None

    # Copying relevant fields over
    serialized["name"] = doc.get("name", "")
    serialized["created"] = doc.get("created", "")

    # Process the nested series list.
    # Each item in the series array should have an 'id' and 'name' field.
    serialized_series = []
    for series_item in doc.get("series", []):
        serialized_series.append({
            "id": series_item.get("id", ""),
            "name": series_item.get("name", "")
        })
    serialized["series"] = serialized_series

    return serialized

def serialize_cardgen_list(docs: list) -> list:
    """
    Serializes a list of CardGen documents.
    """
    return [serialize_cardgen(doc) for doc in docs]