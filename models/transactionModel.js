// ==========================================
// FILE: models/transactionModel.js
// ==========================================
import mongoose from 'mongoose';

// 1. Transaction ki diary ka format bana rahe hain
const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, // Bhejne wale ki User ID
        ref: 'User', // Yeh ID 'User' collection se aayegi
        required: true
    },
    receiverEmail: {
        type: String, // Paane wale ka Email ID
        required: true
    },
    amount: {
        type: Number, // Kitne paise bheje
        required: true
    }
}, {
    // Yeh line automatically date aur time record kar legi ki transaction kab hua
    timestamps: true 
});

// 2. Is format ko ek Model mein badal kar export kar diya
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;