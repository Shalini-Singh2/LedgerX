// ==========================================
// FILE: controllers/userController.js
// ==========================================

import User from '../models/userModel.js'; // Database ka Blueprint (Schema) import kiya
import bcrypt from 'bcryptjs'; // Password ko hash aur compare karne ke liye tool import kiya
import jwt from 'jsonwebtoken'; // Security Token (VIP Entry Pass) banane ke liye library import kiya
import Transaction from '../models/transactionModel.js'; // Nayi Diary (Transaction Model) import ki

/**
 * @desc    Naya User Register Karna
 * @route   POST /api/users/register
 */
export const registerUser = async (req, res) => {
    try {
        // 1. Frontend ya Thunder Client se data nikalna (Destructuring)
        const { name, email, password } = req.body;

        // 2. Check karna ki kya is email ka banda pehle se database mein hai?
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Bhai, yeh email pehle se registered hai!" });
        }

        // 3. Password Hashing (Security ke liye password ko badalna)
        const salt = await bcrypt.genSalt(10); // Salt ek random string hoti hai jo hash ko strong banati hai
        const hashedPassword = await bcrypt.hash(password, salt); // Plain password ko encrypted password mein badla

        // 4. Database mein naya User create karke save karna
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword // Database mein encrypted password hi bhejenge
        });

        // 5. Agar user successfully ban gaya, toh response wapas bhejna
        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                balance: newUser.balance,
                message: "Account ban gaya bhai! 🎉"
            });
        }

    } catch (error) {
        console.log("Error in Registration: ", error.message); // Server terminal par error dekhne ke liye
        res.status(500).json({ message: "Server mein kuch gadbad hai." }); // User ko error return kiya
    }
};

/**
 * @desc    User Login Karna aur Token Dena
 * @route   POST /api/users/login
 */
export const loginUser = async (req, res) => {
    try {
        // 1. User se uski login details (email aur password) lena
        const { email, password } = req.body;

        // 2. Database mein check karna ki kya ye email exist karta hai?
        const user = await User.findOne({ email });

        // 3. Agar user mila, toh uska hashed password check karna
        // bcrypt.compare() user ke plain password aur DB wale hashed password ko internally match karta hai
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // 4. Agar password sahi hai, toh us user ke liye ek JWT Token generate karna
            // { id: user._id } payload hai (token mein ID chhupi hai) aur process.env.JWT_SECRET se sign kiya hai
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d', // Yeh token agle 30 dino tak valid rahega
            });

            // 5. Client ko success message aur uska entry pass (token) return karna
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                token: token, // Agli baar jab user aayega, toh ye token sath layega
                message: "Login ho gaya bhai! 🚀"
            });
        } else {
            // Agar email galat ho ya password match na kare
            res.status(401).json({ message: "Galat email ya password hai bhai!" });
        }
    } catch (error) {
        console.log("Error in Login: ", error.message); // Server debugging ke liye
        res.status(500).json({ message: "Server mein kuch gadbad hai." });
    }
};

/**
 * @desc    User ki profile (balance waghera) dekhna
 * @route   GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
    try {
        // Humara Security Guard (protect middleware) pehle hi check kar chuka hoga ki VIP Pass asli hai.
        // Aur usne user ka data 'req.user' mein daal diya tha. Ab hum usi ID se data nikalenge.
        const user = await User.findById(req.user._id);

        if (user) {
            // Agar user mil gaya, toh uska data response mein bhej do
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                message: "Yeh rahi tumhari profile bhai! 📋"
            });
        } else {
            // Agar token sahi tha par DB mein user nahi mila (maan lo delete ho gaya ho)
            res.status(404).json({ message: "User nahi mila bhai!" });
        }
    } catch (error) {
        console.log("Profile Error: ", error.message);
        res.status(500).json({ message: "Server mein kuch gadbad hai." });
    }
};


/**
 * @desc    Ek user se dusre user ko paise bhejna
 * @route   POST /api/users/transfer
 */
export const transferMoney = async (req, res) => {
    try {
        // 1. Thunder Client/Frontend se data nikalna ki kisko bhejna hai aur kitna bhejna hai
        const { receiverEmail, amount } = req.body;

        // 2. Sender (bhejne wala) kaun hai? Uski ID hume Security Guard (req.user) se mil jayegi
        const sender = await User.findById(req.user._id);

        // 3. Receiver (paane wala) kaun hai? Usko hum email se database mein dhoondhenge
        const receiver = await User.findOne({ email: receiverEmail });

        // 4. Checking 1: Kya jisko paise bhej rahe hain wo database mein hai bhi?
        if (!receiver) {
            return res.status(404).json({ message: "Bhai, jis email par paise bhej rahe ho wo app par nahi hai!" });
        }

        // 5. Checking 2: Bhejne wale ke paas itne paise (balance) hain bhi ya nahi?
        if (sender.balance < amount) {
            return res.status(400).json({ message: "Bhai, account mein itne paise nahi hain!" });
        }

        // 6. Checking 3: Koi khud ko toh paise nahi bhej raha?
        if (sender.email === receiverEmail) {
            return res.status(400).json({ message: "Khud ko paise nahi bhej sakte bhai!" });
        }

        // 7. Balance update karna (Asli calculation)
        sender.balance -= amount; // Bhejne wale ke account se amount minus kiya
        receiver.balance += amount; // Paane wale ke account mein amount plus kiya

        // 8. Dono users ka naya balance wapas database mein save kar diya
        await sender.save();
        await receiver.save();


        // === NAYA CODE YAHAN SE ===
        // 8.5 Diary (Transaction collection) mein ek nayi entry bana rahe hain
        await Transaction.create({
            sender: req.user._id,        // Kisne bheje? (Tumhari ID)
            receiverEmail: receiverEmail, // Kisko bheje? (Dost ka email)
            amount: amount               // Kitne bheje?
        });
        // === NAYA CODE YAHAN TAK ===

        // 9. Success message return kiya
        res.json({
            message: "Paise successfully transfer ho gaye! 💸",
            amountTransferred: amount,
            yourNewBalance: sender.balance
        });

    } catch (error) {
        console.log("Transfer Error: ", error.message);
        res.status(500).json({ message: "Server mein error aayi hai paise bhejte waqt." });
    }
};


/**
 * @desc    User ki passbook (history) dekhna
 * @route   GET /api/users/transactions
 */
export const getTransactionHistory = async (req, res) => {
    try {
        // 1. Database ki diary mein dhoondho jahan 'sender' tumhari ID ho
        // .sort({ createdAt: -1 }) ka matlab hai ki sabse naye transfers sabse upar dikhenge (jaise asli app mein hota hai)
        const history = await Transaction.find({ sender: req.user._id }).sort({ createdAt: -1 });

        // 2. Jo bhi history mili, usko response mein wapas bhej do
        res.json({
            message: "Yeh rahi tumhari passbook! 📖",
            totalTransactions: history.length, // Kitne logo ko paise bheje uska count
            history: history // Asli list
        });

    } catch (error) {
        console.log("History Error: ", error.message);
        res.status(500).json({ message: "History laane mein server gadbad kar raha hai." });
    }
};