import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './models/Hotel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxestays')
  .then(async () => {
    const hotels = await Hotel.find().select('name images');
    console.log(JSON.stringify(hotels, null, 2));
    process.exit();
  });
