import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    uuid: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    hashPswd: { 
        type: String 
    },
    wishList: [{
        cardID: { 
            type: String, 
            required: true 
        }
    }],
    ownedCards: [{
        cardID: { 
            type: String, 
            required: true 
        }
    }]
});


export default mongoose.model("UserSchema", UserSchema);