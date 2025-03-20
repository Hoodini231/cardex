# Functions to calculate trivial expected value and adjusted expected value

import databaseFunctions as db

# Happy flow -> calc trivial expected value -> calc slot price -> calc rarity price -> calc mean price


def calculate_trivial_pack_expected_value(good: str, set: str):
    good_data = db.get_good_data_from_database(good, set) # returns a dictionary with the data of the good

    # sum the expected values of all slots in the pack
    data = good_data["card slots"]
    number_of_slots = good_data["number of slots"]
    card_slot_data = good_data["slots"]

    for slot in card_slots:
        expected_value_output += calculate_expected_value_for_card_slot(slot["rarities"], set)
    return round(expected_value_output, 2)

def calculate_expected_value_for_card_slot(rarities: list, set: str):
    pullrates = db.get_pullrates(rarity, set) # returns a dictionary with the pullrates of the good
    for rarity in rarities:
        # prob of rarity being pulled in this slot * expected value of rarity
        expected_value_output += pullrates[rarity['name']] * calculate_expected_value_for_rarity(rarity, set)
    return expected_value_output

def calculate_expected_value_for_rarity(rarity: str, set: str):
    # grab price rarity from database
    rarity_card_prices = db.get_rarity_prices(rarity, set) # returns a dictionary with the price of the rarity
    card_price = calculate_mean_price(rarity_card_prices)
    return card_price


def calculate_mean_price(prices: list):
    if len(prices) == 0:
        return 0
    else if isinstance(prices[0], int):
        return 0

    mean_price = math.mean(prices)
    return mean_price


