import { ENV } from '../config/env.config.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.database.uri);
    console.log('Database Connected.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;