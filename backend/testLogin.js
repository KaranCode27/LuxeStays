import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function testPassword() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxestays');
  const user = await User.findOne({ email: 'admin@example.com' }).select('+password');
  if(!user) return console.log('Admin user not found');
  console.log('Hashed Password in DB:', user.password);
  
  const isMatch = await user.matchPassword('password123');
  console.log('Match result for password123:', isMatch);

  const john = await User.findOne({ email: 'john@example.com' }).select('+password');
  console.log('John Hash:', john ? john.password : 'not found');
  if(john) console.log('Match result for john:', await john.matchPassword('password123'));
  
  process.exit(0);
}
testPassword();
