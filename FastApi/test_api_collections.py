# mega script of tests
# could refactor everything into traditonal two folders with unit tests and stubs....
import pytest
import csv
from httpx import AsyncClient
from main import app  # Make sure this imports your FastAPI app correctly

# Load set names from the CSV file
def load_set_names_from_csv(path="cardSets.csv"):
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row["cardsets"] for row in reader if row["cardsets"].strip()]

# Parametrize with the list from the CSV
set_names = load_set_names_from_csv()

@pytest.mark.asyncio
@pytest.mark.parametrize("set_name", set_names)
async def test_render_collection(set_name):
    async with AsyncClient( base_url="http://127.0.0.1:8000") as ac:
        response = await ac.get(f"/get/render/collections/{set_name}", params={"page": 1, "pageSize": 60})
        assert response.status_code == 200, f"Failed on set: {set_name}"
        data = response.json()
        assert "data" in data, f"No 'data' field in response for {set_name}"
        assert isinstance(data["data"], list), f"'data' is not a list for {set_name}"
