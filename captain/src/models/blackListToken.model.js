import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }

}, {timestamps: true})

export const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema)