import mongoose from "mongoose";

const PricesSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    id: {
        type: String,
        required: true,
    },
    cardPrices: {
        type: Object,
        required: true,
    },
});  

export default mongoose.model("prices", PricesSchema);
