// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, getUserProfile,transferMoney,getTransactionHistory} from '../controllers/userController.js';

// 2. Apne Security Guard ko import kiya
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Jab koi POST request '/api/users/register' par bhejega, toh registerUser function chalega
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// GET /api/users/profile - Profile dekhega
// DHYAN DO: Yahan humne raste mein 'protect' laga diya. Ab bina pass ke koi aage (getUserProfile tak) nahi ja payega!
router.get('/profile', protect, getUserProfile);


// POST /api/users/transfer - Paise bhejne ka route (Isme bhi guard 'protect' zaroori hai)
router.post('/transfer', protect, transferMoney);

// GET /api/users/transactions - User ki passbook/history dekhega (Isme bhi guard 'protect' zaroori hai)
router.get('/transactions', protect, getTransactionHistory);

export default router;