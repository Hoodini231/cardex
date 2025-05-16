import mongoose from 'mongoose';
import CardSetSchema from './cardSet.js';

// Ability Schema
const AbilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String },
    type: { type: String }
  }, { _id: false });
  
  // Attack Schema
  const AttackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: [{ type: String }],
    convertedEnergyCost: { type: Number },
    damage: { type: String },
    text: { type: String }
  }, { _id: false });
  
  // Weakness Schema
  const WeaknessSchema = new mongoose.Schema({
    type: { type: String },
    value: { type: String }
  }, { _id: false });

const CardSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    supertype: { 
        type: String 
    },
    subtypes: [{ type: String }],
    hp: { 
        type: String 
    },
    types: [{ type: String }],
    evolvesFrom: { type: String },
    abilities: [AbilitySchema],
    attacks: [AttackSchema],
    weaknesses: [WeaknessSchema],
    retreatCost: [{ type: String }],
    convertedRetreatCost: { type: Number },
    set: String,
    number: { 
        type: String 
    },
    artist: { 
        type: String 
    },
    rarity: { 
        type: String 
    },
    flavorText: { 
        type: String
    },
    nationalPokedexNumbers: [{ type: Number }],
    legalities: {
      unlimited: { type: String },
      standard: { type: String },
      expanded: { type: String }
    },
    imageLarge: { type: String },
    imageSmall: { type: String },
    chase: {
      type: Boolean,
      default: false
    }
    
  });
  
  export default mongoose.model("Card", CardSchema);