// models/userModel.js
import mongoose from 'mongoose';

// 1. Schema (Structure) Define kar rahe hain
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Yeh field zaroori hai (blank nahi chhod sakte)
    },
    email: {
        type: String,
        required: true,
        unique: true // Ek email se do accounts nahi ban sakte
    },
    password: {
        type: String,
        required: true // Password zaroori hai
    },
    balance: {
        type: Number,
        default: 10000 // Jab bhi naya user banega, usko default ₹10,000 milenge
    }
}, {
    // Yeh MongoDB ko bolega ki "created_at" aur "updated_at" time apne aap record kar le
    timestamps: true 
});

// 2. Is Schema ka use karke ek Model (Blueprint) banaya
const User = mongoose.model('User', userSchema);

// 3. Isko Export kar diya taaki baaki files isko use kar sakein
export default User;