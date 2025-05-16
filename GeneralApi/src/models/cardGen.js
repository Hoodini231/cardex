import mongoose from "mongoose";

const CardGenSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    series: [{
        id: { 
          type: String, 
          required: true 
        },
        name: { 
          type: String, 
          required: true 
        }
      }]
    }
);  

export default mongoose.model("CardGen", CardGenSchema);
