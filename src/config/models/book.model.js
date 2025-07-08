import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    auther: {
        type: String,
        default: 'Unknown'
    },
    genre: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

export const bookData = mongoose.model('book', bookSchema);