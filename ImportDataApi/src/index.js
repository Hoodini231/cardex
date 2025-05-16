import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cardSet from "./models/cardSet.js";
import cardGen from "./models/cardGen.js";
import User from "./models/User.js";
import card from "./models/Card.js";
import dotenv from "dotenv";
import pokemon from 'pokemontcgsdk';
import { Axis3DIcon, Server } from "lucide-react";

dotenv.config();

const databaseString = 'mongodb+srv://updateDBAPI:ffHeSUl4yw8CTEPB@tcg-set-cluster.pzb8q.mongodb.net/?retryWrites=true&w=majority&appName=TCG-Set-Cluster'

const pokemonTCG_APIKEY = process.env.POKEMON_TCG_API_KEY

pokemon.configure({apiKey: pokemonTCG_APIKEY})

const app = express();



mongoose.connect(databaseString)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5001, () => {
            console.log('Server is running on port 5001');
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
    });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 10000
}));

app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 10000
}))


/* dont need to upload all cards anymore
*/

// app.get('/upload/all/cards', async (req, res) => {
//     try {
//         console.log("recieved");
//         pokemon.card.all().then(async (response) => {
            
//             console.log("found");
//             console.log(response);

//             const cards = response; // Assuming response is an array of cards

//             const savePromises = cards.map(card_data => {
//                 const newCard = new card({
//                     id: card_data.id,
//                     name: card_data.name,
//                     supertype: card_data.supertype,
//                     subtypes: card_data.subtypes,
//                     hp: card_data.hp,
//                     types: card_data.types,
//                     evolvesFrom: card_data.evolvesFrom == undefined ? "" : card_data.evolvesFrom,
//                     abilities: card_data.abilities,
//                     attacks: card_data.attacks,
//                     weaknesses: card_data.weaknesses,
//                     retreatCost: card_data.retreatCost,
//                     convertedRetreatCost: card_data.convertedRetreatCost,
//                     set: card_data.set.name,
//                     setId: card_data.set.number,
//                     setSeries: card_data.set.series,
//                     artist: card_data.artist,
//                     number: card_data.number,
//                     rarity: card_data.rarity,
//                     flavorText: card_data.flavorText,
//                     imageSmall: card_data.images.small,
//                     imageLarge: card_data.images.large,
//                     nationalPokedexNumbers: card_data.nationalPokedexNumbers,
//                     legalities: card_data.legalities,
//                 });

//                 console.log("saving card");
//                 return newCard.save();
//             });

//             await Promise.all(savePromises);
//             console.log("success");
//             res.status(200).send(newCard);
//             })
//         } catch (error) {
//         console.error(error)
//     }

// });


app.get('/api/test', async (req, res) => {
    try {
        console.log("recieved");
        pokemon.card.find('base1-4').then(async (response) => {
            
            console.log("found");
            console.log(response);

            const card_data = response; // Assuming response is an array of cards

            const newCard = new card({
                    id: card_data.id,
                    name: card_data.name,
                    supertype: card_data.supertype,
                    subtypes: card_data.subtypes,
                    hp: card_data.hp,
                    types: card_data.types,
                    evolvesFrom: card_data.evolvesFrom == undefined ? "" : card_data.evolvesFrom,
                    abilities: card_data.abilities,
                    attacks: card_data.attacks,
                    weaknesses: card_data.weaknesses,
                    retreatCost: card_data.retreatCost,
                    convertedRetreatCost: card_data.convertedRetreatCost,
                    set: card_data.set.name,
                    setId: card_data.set.number,
                    setSeries: card_data.set.series,
                    artist: card_data.artist,
                    number: card_data.number,
                    rarity: card_data.rarity,
                    flavorText: card_data.flavorText,
                    imageSmall: card_data.images.small,
                    imageLarge: card_data.images.large,
                    nationalPokedexNumbers: card_data.nationalPokedexNumbers,
                    legalities: card_data.legalities,
                });

                console.log("saving card");
                await newCard.save();
                console.log("success");
                res.status(200).send(newCard);
            })
        } catch (error) {
        console.error(error)
    }
});

/**
 * Upload all card sets to mongo DB
 * 
 */

app.get('/upload/all/cardSets', async (req, res) => {
    try {
        console.log("recieved");
        pokemon.set.all().then(async (response) => {
            
            console.log("found");
            console.log(response);

            const cardSets = response; // Assuming response is an array of cardSets

            const savePromises = cardSets.map(cardSet_data => {
                const newCardSet = new cardSet({
                    id: cardSet_data.id,
                    name: cardSet_data.name,
                    series: cardSet_data.series,
                    printedTotal: cardSet_data.printedTotal == undefined ? 0 : cardSet_data.printedTotal,
                    total: cardSet_data.total == undefined ? 0 : cardSet_data.total,
                    legalities: cardSet_data.legalities,
                    ptcgoCode: cardSet_data.ptcgoCode,
                    releaseDate: cardSet_data.releaseDate,
                    updatedAt: cardSet_data.updatedAt,
                    symbol: cardSet_data.images.symbol,
                    logo: cardSet_data.images.logo,
                });

                console.log("saving cardSet");
                return newCardSet.save();
            });

            await Promise.all(savePromises);
            console.log("success");
            res.status(200).send(newCardSet);
            })
    } catch (error) {
        console.error(error)

    }
});

app.get('/upload/all/cardGens', async (req, res) => {
    try {
        console.log("recieved");
        pokemon.set.all().then(async (response) => {
            
            console.log("found");
            console.log(response);

            const cardSets = response; // Assuming response is an array of cardSets

            const distinctSeries = [...new Set(cardSets.map(cardSet_data => cardSet_data.series))];
            console.log(distinctSeries);

            distinctSeries.forEach(async (series) => {
                const sets = cardSets.filter(cardSet_data => cardSet_data.series == series);
                console.log(sets);
                const newCardGen = new cardGen({
                    name: series,
                    series: sets,
                });

                console.log("saving cardGen");
                await newCardGen.save();
            });
            console.log("success");
            })
    } catch (error) {
        console.error(error)

    }
});

app.get('/get/cardSets', async (req, res) => {
    try {
        const setName = req.query.set;
        console.log(setName);
        const cardSets = await card.find({ set: setName });
        
        res.status(200).send(cardSets);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update/all/cards', async (req, res) => {
    try {
      console.log("received");
      // Fetch all cards from the external API
      const response = await pokemon.card.all();
      console.log("found");
      console.log(response);
  
      // For each card, update the imageSmall and imageLarge fields on the document that matches the card id.
      const updatePromises = response.map(async (card_data) => {
        // Use the card id to find the existing record.
        const query = { id: card_data.id };
        // Create an update object that adds or updates the image fields.
        const update = {
          $set: {
            imageSmall: card_data.images.small,
            imageLarge: card_data.images.large,
          },
        };
        // Use upsert:true so that if the document doesn’t exist, it will be created.
        const options = { upsert: true, new: true };
  
        // Update the record and return the updated document.
        return await card.findOneAndUpdate(query, update, options);
      });
  
      // Wait for all the update operations to complete.
      const results = await Promise.all(updatePromises);
      console.log("success");
      res.status(200).send(results);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating cards");
    }
  });

  app.get('/get/gens', async (req, res) => {
    try {
        const gens = await cardGen.find({});
        res.status(200).send(gens);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  
  