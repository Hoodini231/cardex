# Functions to calculate trivial expected value and adjusted expected value

import databaseFunctions as db

# Happy flow -> calc trivial expected value -> calc slot price -> calc rarity price -> calc mean price


async def calculate_trivial_pack_expected_value(set: str):
    product_data = await db.get_product_data("pack", set) # returns a dictionary with the data of the good
    # sum the expected values of all slots in the pack
    print("calculating trivial pack expected value")
    expected_value_output = 0
    output = {}
    index = 1
    print("product_data: ", product_data)
    for slot in product_data:
        print("slot: ", slot)
        slot_expected_value = await calculate_expected_value_for_card_slot(slot, set)
        expected_value_output += slot_expected_value
        slot_object = {
            "id" : index,
            "rarities": slot,
            "expected_value" : slot_expected_value
        }
        output[f"Slot {index}" ] = slot_object
        index += 1
    output['Expected Value'] = round(expected_value_output, 2)
    return output

async def calculate_expected_value_for_card_slot(rarities: list, set: str):
    print("Calculating expected value for slot")
    pullrates = await db.get_pullrates(set) # returns a dictionary with the pullrates of the good
    expected_value_output = 0
    if pullrates:
        print(rarities)
        for rarity in rarities:
            # prob of rarity being pulled in this slot * expected value of rarity
            if "Energy" in rarity:
                expected_value_output += 0.05
            else: 
                expected_value_output += pullrates[rarity] * (await calculate_expected_value_for_rarity(rarity, set))
        print("Exepcted value for slot: ", expected_value_output)
        return expected_value_output
    else:
        return 0

async def calculate_expected_value_for_rarity(rarity: str, set: str):
    print("Calculating expected value for rarity")
    # grab price rarity from database
    if "Reverse Holo" in rarity:
        rarity = "Reverse Holo"
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


