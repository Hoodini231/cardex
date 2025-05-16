import mongoose from "mongoose";

const CardSetSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    series: { 
        type: String 
    },
    printedTotal: { 
        type: Number 
    },
    total: { 
        type: Number 
    },
    legalities: {
      unlimited: { type: String },
      standard: { type: String },
      expanded: { type: String }
    },
    ptcgoCode: { 
        type: String 
    },
    releaseDate: { 
        type: String 
    },
    updatedAt: { 
        type: String 
    },
    images: {
      symbol: { type: String }
    }
});


export default mongoose.model("CardSet", CardSetSchema);