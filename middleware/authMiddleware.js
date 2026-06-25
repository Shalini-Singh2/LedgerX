// ==========================================
// FILE: middleware/authMiddleware.js
// ==========================================

import jwt from 'jsonwebtoken'; // Token (VIP Pass) ko check karne ki machine (library) mangwayi
import User from '../models/userModel.js'; // Database se user ka data nikalne ke liye blueprint mangwaya

// Yeh hamara main Security Guard function hai jiska naam 'protect' rakha hai
export const protect = async (req, res, next) => {
    let token; // Token store karne ke liye ek khali variable banaya

    // 1. Check kar rahe hain ki kya user ne apne sath 'Authorization' header bheja hai?
    // Aur kya wo token 'Bearer' word se shuru hota hai? (Yeh ek standard format hota hai)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Token ko alag karna. 'Bearer kjhdfks...' mein se sirf token wala hissa (index 1) nikal rahe hain
            token = req.headers.authorization.split(' ')[1];

            // 3. Token ko apni Secret Key (process.env.JWT_SECRET) ke sath match karke verify kar rahe hain
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Token ke andar user ki ID chhupi hoti hai (jo login ke time daali thi).
            // Us ID se database mein user ko dhoondh rahe hain. 
            // '.select('-password')' ka matlab hai ki user ka data toh laao, par password mat laana (Security ke liye)
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Sab kuch sahi hai! Guard ne check kar liya, ab next() likh kar usko andar jaane ki permission de di
            next();
            
        } catch (error) {
            // Agar token farzi (fake) nikla ya expire ho gaya toh error aayegi
            console.error(error); // Error ko server terminal par print kiya
            res.status(401).json({ message: "Bhai, token fail ho gaya! Permission nahi hai." }); // User ko bhaga diya
        }
    }

    // 6. Agar user ne koi token bheja hi nahi
    if (!token) {
        res.status(401).json({ message: "Bhai, token hi nahi hai! Entry allowed nahi hai." });
    }
};