import jwt from 'jsonwebtoken'
import { userData } from '../config/models/user.model.js'

export const authenticateUser = async (req, res, next) => {
    try {
        var token;
        if (req.cookies?.accessToken || req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(400).json({ susccess: false, message: "Authorization token is required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ success: false, message: 'Invalid token: userId not found' });
        }

        const user = await userData.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export const checkUserRole = (role) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({ success: false, message: "User not authenticated" });
            }

            const userId = req.user._id;
            const user = await userData.findById(userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            if(!role.includes(user.role)){
                return res.status(403).json({ success: false, message: "Unauthorized access" })
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}