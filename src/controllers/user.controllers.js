import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userData } from "../config/models/user.model.js";


//Generate JWT token
const generateAuthToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

export const signUp = async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existedUser = await userData.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ success: false, message: 'Email is already exist!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userData({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.log('Error While SignUp, ', error);
        res.status(500).json({ success: false, message: 'Server Error' })
    }
};

export const getAllUsers = async(req, res) => {
    try {
        const users = await userData.find();
        const totalUsers = await userData.countDocuments();
        res.status(200).json({ success: true, totalUsers, data: users });
    } catch (error) {
        console.log('Error fetching all the users!', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getUserById = async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid UserId' });
    }

    try {
        const user = await userData.findById(id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log('Error fetching the user! ', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userData.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Password!' });
        }
        const token = generateAuthToken(user);
        let options = {
            maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            signed: true // Indicates if the cookie should be signed
        }
        res.cookie('accessToken', token, options)
            .status(200)
            .cookie('accessToken', token) 
            .json({ success: true, data: 'Login Successful', user, token });
    } catch (error) {
        console.log('Error While Login, ', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json({ success: true, message: 'Logout Successful' });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid UserId' });
        }
        const existUser = await userData.findById(id);
        if (!existUser) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
        await userData.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User Deleted' });
    } catch (error) {
        console.log('Error while deleting a user, ', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { name, email, password } = req.body;
    let hashedPassword;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid UserId' });
        }

        const existUser = await userData.findById(user._id);
        if (!existUser) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        if(password){
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (existUser._id === id) {
            const updatedUser = await userData.findByIdAndUpdate(
                id,
                { 
                    name : name || existUser.name, 
                    email: email || existUser.email, 
                    password: hashedPassword || existUser.password
                },
                { new: true }
            );
            res.status(200).json({ success: true, data: updatedUser });
        }
    } catch (error) {
        console.log('Error while updating the user, ', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
