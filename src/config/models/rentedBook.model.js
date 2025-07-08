import mongoose, { Schema } from "mongoose";

const rentedBookSchema = new mongoose.Schema({
    issuedBook: { type: Schema.Types.ObjectId, ref: 'book' },
    issuedToUser: { type: Schema.Types.ObjectId, ref: 'user' },
    rentDays: { type: Number, required: true },
}, { timestamps: true });

export const rentedBookData = mongoose.model('rentedBook', rentedBookSchema);