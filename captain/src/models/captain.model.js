import mongoose from "mongoose";


const captainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    isAvaliable: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});


export const Captain = mongoose.model("Captain", captainSchema);