# Functions to calculate trivial expected value and adjusted expected value

import databaseFunctions as db

# Happy flow -> calc trivial expected value -> calc slot price -> calc rarity price -> calc mean price


async def calculate_trivial_pack_expected_value(set: str):
    product_data = await db.get_product_data("pack", set) # returns a dictionary with the data of the good
    # sum the expected values of all slots in the pack
    expected_value_output = 0
    for slot in product_data:
        expected_value_output += await calculate_expected_value_for_card_slot(product_data[slot], set)
    return round(expected_value_output, 2)

async def calculate_expected_value_for_card_slot(rarities: list, set: str):
    pullrates = await db.get_pullrates(set) # returns a dictionary with the pullrates of the good
    expected_value_output = 0
    if pullrates:
        print(rarities)
        for rarity in rarities:
            # prob of rarity being pulled in this slot * expected value of rarity
            expected_value_output += pullrates[rarity] * (await calculate_expected_value_for_rarity(rarity, set))
        print("Exepcted value for slot: ", expected_value_output)
        return expected_value_output
    else:
        return 0

async def calculate_expected_value_for_rarity(rarity: str, set: str):
    # grab price rarity from database
    if "Energy" in rarity:
        return 0.50
    rarity_card_prices = await db.get_rarity_prices(rarity, set) # returns a dictionary with the price of the rarity
    #card_price = calculate_mean_price(rarity_card_prices)
    return rarity_card_prices


def calculate_mean_price(prices: list):
    if len(prices) == 0:
        return 0
    elif isinstance(prices[0], int):
        return 0

    mean_price = math.mean(prices)
    return mean_price


