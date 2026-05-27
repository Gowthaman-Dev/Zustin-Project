// backend/config/db.js
import mongoose from 'mongoose';

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected Successfully ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error:`, error);
    process.exit(1);
  }
};

export default connectdb;