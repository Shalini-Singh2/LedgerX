// 1. Zaroori tools ko import kar rahe hain (Jo humne npm install kiye the)
import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js'; 
// 4. JSON format samajhne ki shakti de rahe hain (Aage use hoga)
import userRoutes from './routes/userRoutes.js';

import cors from 'cors';
// Abhi tumhara server (localhost:5000) sirf Thunder Client se baat kar raha hai. 
// Kal ko jab hum apna Frontend banayenge (maan lo wo localhost:3000 par chal raha hai),
//  toh Google Chrome security reasons ki wajah se un dono ko baat nahi karne dega. CORS 
// lagane se hum apne server ko bolte hain: "Bhai, Frontend 
// apna hi banda hai, iski requests ko block mat karna."

// 2. Secret file (.env) ko padhne ki permission de rahe hain
dotenv.config();
connectDB(); 


// 3. Express ka app (Humara Receptionist) bana rahe hain
const app = express();

// Cross-Origin permission allow kar rahe hain
// app.use(cors()); 
app.use(cors({
    origin: "ledger-x-liart.vercel.app", // Yahan apna Vercel ka asli link daalna (bina aakhri slash '/' ke)
    credentials: true
}));

app.use(express.json()); // Yeh line tumhare paas pehle se hai


app.use(express.json());
app.use('/api/users', userRoutes); 
// 5. Ek simple GET API bana rahe hain (Jab koi darwaze par aayega toh kya bolna hai)
// req = Request (Jo user maang raha hai), res = Response (Jo hum wapas bhejenge)
app.get('/', (req, res) => {
    res.send("Hello Bhai! LedgerX ka server ekdum badhiya chal raha hai! 🚀");
});

// 6. Server ko start kar rahe hain aur Port 5000 par baitha rahe hain
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});