import mongoose, { Schema } from "mongoose";

// ----MongoSchema---- 
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required!'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [30, 'Name can not be more than 30 characters long']
    },
    email:{
        type: String,
        required: [true, 'Email is required!'],
        unique: [true, 'Email is already exist!'],
        lowercase: [true, 'Email must be in lowercase'],
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [5, 'Password must be at least 5 characters long']
    },
    role: {
        type: String,
        enum: ['librarian', 'customer'],
        default: 'customer'
    }
}, { timestamps: true });

export const userData = mongoose.model('user', userSchema);