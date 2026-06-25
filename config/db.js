// config/db.js
import mongoose from 'mongoose';

// Ek async function banaya kyunki internet ke through database connect hone mein time lagega
const connectDB = async () => {
    try {
        // await lagaya taaki code yahan ruke jab tak connection na ho jaye
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        // Agar error aaya toh server ko zabardasti band kar do
        process.exit(1); 
    }
};

// Yeh file ka VIP function hai, isliye Default Export kiya
export default connectDB;