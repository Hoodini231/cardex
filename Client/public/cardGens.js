import { create } from "domain";

const cardGens = [
    {
        "id": "67d314d8966d113a80e4eb82",
        "name": "Other",
        "shortName": "Oth",
        "created": 1960,
        "series": [
            {
                "id": "base6",
                "name": "Legendary Collection"
            },
            {
                "id": "ru1",
                "name": "Pokémon Rumble"
            },
            {
                "id": "mcd16",
                "name": "McDonald's Collection 2016"
            },
            {
                "id": "mcd11",
                "name": "McDonald's Collection 2011"
            },
            {
                "id": "mcd14",
                "name": "McDonald's Collection 2014"
            },
            {
                "id": "mcd17",
                "name": "McDonald's Collection 2017"
            },
            {
                "id": "mcd21",
                "name": "McDonald's Collection 2021"
            },
            {
                "id": "mcd19",
                "name": "McDonald's Collection 2019"
            },
            {
                "id": "mcd18",
                "name": "McDonald's Collection 2018"
            },
            {
                "id": "fut20",
                "name": "Pokémon Futsal Collection"
            },
            {
                "id": "mcd22",
                "name": "McDonald's Collection 2022"
            },
            {
                "id": "si1",
                "name": "Southern Islands"
            },
            {
                "id": "mcd12",
                "name": "McDonald's Collection 2012"
            },
            {
                "id": "mcd15",
                "name": "McDonald's Collection 2015"
            },
            {
                "id": "bp",
                "name": "Best of Game"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4eb77",
        "name": "Base",
        "shortName": "Base",
        "created": 1996,
        "series": [
            {
                "id": "base2",
                "name": "Jungle"
            },
            {
                "id": "basep",
                "name": "Wizards Black Star Promos"
            },
            {
                "id": "base5",
                "name": "Team Rocket"
            },
            {
                "id": "base1",
                "name": "Base"
            },
            {
                "id": "base3",
                "name": "Fossil"
            },
            {
                "id": "base4",
                "name": "Base Set 2"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4eb7e",
        "name": "E-Card",
        "shortName":"EC",
        "created": 2002,
        "series": [
            {
                "id": "ecard2",
                "name": "Aquapolis"
            },
            {
                "id": "ecard1",
                "name": "Expedition Base Set"
            },
            {
                "id": "ecard3",
                "name": "Skyridge"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebbf",
        "name": "Black & White",
        "shortName": "BW",
        "created": 2011, 
        "series": [
            {
                "id": "dv1",
                "name": "Dragon Vault"
            },
            {
                "id": "bw7",
                "name": "Boundaries Crossed"
            },
            {
                "id": "bw2",
                "name": "Emerging Powers"
            },
            {
                "id": "bw10",
                "name": "Plasma Blast"
            },
            {
                "id": "bw3",
                "name": "Noble Victories"
            },
            {
                "id": "bw8",
                "name": "Plasma Storm"
            },
            {
                "id": "bw9",
                "name": "Plasma Freeze"
            },
            {
                "id": "bwp",
                "name": "BW Black Star Promos"
            },
            {
                "id": "bw1",
                "name": "Black & White"
            },
            {
                "id": "bw4",
                "name": "Next Destinies"
            },
            {
                "id": "bw5",
                "name": "Dark Explorers"
            },
            {
                "id": "bw6",
                "name": "Dragons Exalted"
            },
            {
                "id": "bw11",
                "name": "Legendary Treasures"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebba",
        "name": "Platinum",
        "shortName": "Plat",
        "created": 2008,
        "series": [
            {
                "id": "pl4",
                "name": "Arceus"
            },
            {
                "id": "pl2",
                "name": "Rising Rivals"
            },
            {
                "id": "pl3",
                "name": "Supreme Victors"
            },
            {
                "id": "pl1",
                "name": "Platinum"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebb1",
        "name": "Diamond & Pearl",
        "shortName": "DP",
        "created": 2007,
        "series": [
            {
                "id": "dpp",
                "name": "DP Black Star Promos"
            },
            {
                "id": "dp2",
                "name": "Mysterious Treasures"
            },
            {
                "id": "dp3",
                "name": "Secret Wonders"
            },
            {
                "id": "dp4",
                "name": "Great Encounters"
            },
            {
                "id": "dp5",
                "name": "Majestic Dawn"
            },
            {
                "id": "dp1",
                "name": "Diamond & Pearl"
            },
            {
                "id": "dp6",
                "name": "Legends Awakened"
            },
            {
                "id": "dp7",
                "name": "Stormfront"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebcd",
        "name": "XY",
        "shortName": "XY",
        "created": 2013,
        "series": [
            {
                "id": "xy4",
                "name": "Phantom Forces"
            },
            {
                "id": "xy6",
                "name": "Roaring Skies"
            },
            {
                "id": "xy7",
                "name": "Ancient Origins"
            },
            {
                "id": "xyp",
                "name": "XY Black Star Promos"
            },
            {
                "id": "xy5",
                "name": "Primal Clash"
            },
            {
                "id": "dc1",
                "name": "Double Crisis"
            },
            {
                "id": "xy8",
                "name": "BREAKthrough"
            },
            {
                "id": "xy10",
                "name": "Fates Collide"
            },
            {
                "id": "xy12",
                "name": "Evolutions"
            },
            {
                "id": "xy0",
                "name": "Kalos Starter Set"
            },
            {
                "id": "xy9",
                "name": "BREAKpoint"
            },
            {
                "id": "xy11",
                "name": "Steam Siege"
            },
            {
                "id": "xy1",
                "name": "XY"
            },
            {
                "id": "xy2",
                "name": "Flashfire"
            },
            {
                "id": "xy3",
                "name": "Furious Fists"
            },
            {
                "id": "g1",
                "name": "Generations"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebde",
        "name": "Sun & Moon",
        "shortName": "SM",
        "created": 2017,
        "series": [
            {
                "id": "smp",
                "name": "SM Black Star Promos"
            },
            {
                "id": "det1",
                "name": "Detective Pikachu"
            },
            {
                "id": "sm7",
                "name": "Celestial Storm"
            },
            {
                "id": "sm3",
                "name": "Burning Shadows"
            },
            {
                "id": "sm35",
                "name": "Shining Legends"
            },
            {
                "id": "sm6",
                "name": "Forbidden Light"
            },
            {
                "id": "sm75",
                "name": "Dragon Majesty"
            },
            {
                "id": "sm12",
                "name": "Cosmic Eclipse"
            },
            {
                "id": "sm1",
                "name": "Sun & Moon"
            },
            {
                "id": "sm2",
                "name": "Guardians Rising"
            },
            {
                "id": "sm4",
                "name": "Crimson Invasion"
            },
            {
                "id": "sm5",
                "name": "Ultra Prism"
            },
            {
                "id": "sm8",
                "name": "Lost Thunder"
            },
            {
                "id": "sm9",
                "name": "Team Up"
            },
            {
                "id": "sm10",
                "name": "Unbroken Bonds"
            },
            {
                "id": "sm11",
                "name": "Unified Minds"
            },
            {
                "id": "sm115",
                "name": "Hidden Fates"
            },
            {
                "id": "sma",
                "name": "Hidden Fates Shiny Vault"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ebf1",
        "name": "Sword & Shield",
        "shortName": "SWSH",
        "created": 2020,
        "series": [
            {
                "id": "swshp",
                "name": "SWSH Black Star Promos"
            },
            {
                "id": "swsh1",
                "name": "Sword & Shield"
            },
            {
                "id": "swsh35",
                "name": "Champion's Path"
            },
            {
                "id": "swsh45sv",
                "name": "Shining Fates Shiny Vault"
            },
            {
                "id": "swsh5",
                "name": "Battle Styles"
            },
            {
                "id": "pgo",
                "name": "Pokémon GO"
            },
            {
                "id": "swsh12",
                "name": "Silver Tempest"
            },
            {
                "id": "swsh45",
                "name": "Shining Fates"
            },
            {
                "id": "cel25c",
                "name": "Celebrations: Classic Collection"
            },
            {
                "id": "swsh9",
                "name": "Brilliant Stars"
            },
            {
                "id": "swsh11tg",
                "name": "Lost Origin Trainer Gallery"
            },
            {
                "id": "swsh12pt5gg",
                "name": "Crown Zenith Galarian Gallery"
            },
            {
                "id": "swsh3",
                "name": "Darkness Ablaze"
            },
            {
                "id": "swsh4",
                "name": "Vivid Voltage"
            },
            {
                "id": "swsh7",
                "name": "Evolving Skies"
            },
            {
                "id": "cel25",
                "name": "Celebrations"
            },
            {
                "id": "swsh8",
                "name": "Fusion Strike"
            },
            {
                "id": "swsh10",
                "name": "Astral Radiance"
            },
            {
                "id": "swsh2",
                "name": "Rebel Clash"
            },
            {
                "id": "swsh6",
                "name": "Chilling Reign"
            },
            {
                "id": "swsh9tg",
                "name": "Brilliant Stars Trainer Gallery"
            },
            {
                "id": "swsh10tg",
                "name": "Astral Radiance Trainer Gallery"
            },
            {
                "id": "swsh11",
                "name": "Lost Origin"
            },
            {
                "id": "swsh12tg",
                "name": "Silver Tempest Trainer Gallery"
            },
            {
                "id": "swsh12pt5",
                "name": "Crown Zenith"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ec12",
        "name": "Scarlet & Violet",
        "shortName": "SV",
        "created": 2023,
        "series": [
            {
                "id": "sv1",
                "name": "Scarlet & Violet"
            },
            {
                "id": "svp",
                "name": "Scarlet & Violet Black Star Promos"
            },
            {
                "id": "sv2",
                "name": "Paldea Evolved"
            },
            {
                "id": "sve",
                "name": "Scarlet & Violet Energies"
            },
            {
                "id": "sv3",
                "name": "Obsidian Flames"
            },
            {
                "id": "sv3pt5",
                "name": "151"
            },
            {
                "id": "sv4",
                "name": "Paradox Rift"
            },
            {
                "id": "sv4pt5",
                "name": "Paldean Fates"
            },
            {
                "id": "sv5",
                "name": "Temporal Forces"
            },
            {
                "id": "sv6",
                "name": "Twilight Masquerade"
            },
            {
                "id": "sv6pt5",
                "name": "Shrouded Fable"
            },
            {
                "id": "sv7",
                "name": "Stellar Crown"
            },
            {
                "id": "sv8",
                "name": "Surging Sparks"
            },
            {
                "id": "sv8pt5",
                "name": "Prismatic Evolutions"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ec0b",
        "name": "HeartGold & SoulSilver",
        "shortName": "HGSS",
        "created": 2010,
        "series": [
            {
                "id": "hgss1",
                "name": "HeartGold & SoulSilver"
            },
            {
                "id": "hgss3",
                "name": "HS—Undaunted"
            },
            {
                "id": "hgss2",
                "name": "HS—Unleashed"
            },
            {
                "id": "hgss4",
                "name": "HS—Triumphant"
            },
            {
                "id": "col1",
                "name": "Call of Legends"
            },
            {
                "id": "hsp",
                "name": "HGSS Black Star Promos"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ec21",
        "name": "Neo",
        "shortName": "Neo",
        "created": 2001,
        "series": [
            {
                "id": "neo1",
                "name": "Neo Genesis"
            },
            {
                "id": "neo2",
                "name": "Neo Discovery"
            },
            {
                "id": "neo4",
                "name": "Neo Destiny"
            },
            {
                "id": "neo3",
                "name": "Neo Revelation"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ec28",
        "name": "Gym",
        "shortName": "Gym",
        "created": 2000,
        "series": [
            {
                "id": "gym1",
                "name": "Gym Heroes"
            },
            {
                "id": "gym2",
                "name": "Gym Challenge"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4ec26",
        "name": "NP",
        "shortName": "NP",
        "created": 1997,
        "series": [
            {
                "id": "np",
                "name": "Nintendo Black Star Promos"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4eba7",
        "name": "POP",
        "shortName": "POP",
        "created": 2007,
        "series": [
            {
                "id": "pop1",
                "name": "POP Series 1"
            },
            {
                "id": "pop2",
                "name": "POP Series 2"
            },
            {
                "id": "pop3",
                "name": "POP Series 3"
            },
            {
                "id": "pop4",
                "name": "POP Series 4"
            },
            {
                "id": "pop5",
                "name": "POP Series 5"
            },
            {
                "id": "pop7",
                "name": "POP Series 7"
            },
            {
                "id": "pop9",
                "name": "POP Series 9"
            },
            {
                "id": "pop8",
                "name": "POP Series 8"
            },
            {
                "id": "pop6",
                "name": "POP Series 6"
            }
        ]
    },
    {
        "id": "67d314d8966d113a80e4eb92",
        "name": "EX",
        "shortName": "EX",
        "created": 2003,
        "series": [
            {
                "id": "ex1",
                "name": "Ruby & Sapphire"
            },
            {
                "id": "ex2",
                "name": "Sandstorm"
            },
            {
                "id": "ex4",
                "name": "Team Magma vs Team Aqua"
            },
            {
                "id": "ex5",
                "name": "Hidden Legends"
            },
            {
                "id": "ex7",
                "name": "Team Rocket Returns"
            },
            {
                "id": "ex15",
                "name": "Dragon Frontiers"
            },
            {
                "id": "tk1a",
                "name": "EX Trainer Kit Latias"
            },
            {
                "id": "ex13",
                "name": "Holon Phantoms"
            },
            {
                "id": "tk2a",
                "name": "EX Trainer Kit 2 Plusle"
            },
            {
                "id": "tk2b",
                "name": "EX Trainer Kit 2 Minun"
            },
            {
                "id": "ex10",
                "name": "Unseen Forces"
            },
            {
                "id": "ex11",
                "name": "Delta Species"
            },
            {
                "id": "ex12",
                "name": "Legend Maker"
            },
            {
                "id": "ex14",
                "name": "Crystal Guardians"
            },
            {
                "id": "ex16",
                "name": "Power Keepers"
            },
            {
                "id": "ex3",
                "name": "Dragon"
            },
            {
                "id": "ex6",
                "name": "FireRed & LeafGreen"
            },
            {
                "id": "ex8",
                "name": "Deoxys"
            },
            {
                "id": "ex9",
                "name": "Emerald"
            },
            {
                "id": "tk1b",
                "name": "EX Trainer Kit Latios"
            }
        ]
    }
]

export default cardGens;