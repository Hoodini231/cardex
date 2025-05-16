import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    products: {
        type: Object,
        required: true,
    }
});  

export default mongoose.model("products", ProductsSchema);
