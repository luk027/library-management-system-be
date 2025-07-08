import mongoose, { Schema } from "mongoose";

const purchasedBookSchema = new mongoose.Schema({
    purchasedBook: { type: Schema.Types.ObjectId, ref: 'book' },
    purchasedByUser: { type: Schema.Types.ObjectId, ref: 'user' },
    stock: { type: Number, default: 1 }
}, { timestamps: true });

export const purchasedBookData = mongoose.model('purchasedBook', purchasedBookSchema);