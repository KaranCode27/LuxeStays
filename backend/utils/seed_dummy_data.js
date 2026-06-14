import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import ContactMessage from '../models/ContactMessage.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxestays')
  .then(() => console.log('MongoDB Connected for Dummy Data Seeding'))
  .catch(err => console.error(err));

const seedDummyData = async () => {
  try {
    // Delete existing dummy data to avoid duplicates
    await Booking.deleteMany();
    await Review.deleteMany();
    await ContactMessage.deleteMany();

    const users = await User.find();
    const hotels = await Hotel.find();
    const rooms = await Room.find();

    if (users.length === 0 || hotels.length === 0 || rooms.length === 0) {
      console.log('Please run the main seeder first to populate users, hotels, and rooms.');
      process.exit();
    }

    const regularUser = users.find(u => u.role === 'user') || users[0];
    const adminUser = users.find(u => u.role === 'admin') || users[1];

    // Create Dummy Bookings
    const bookings = [
      {
        userRef: regularUser._id,
        hotelRef: hotels[0]._id,
        roomRef: rooms.find(r => r.hotelRef.toString() === hotels[0]._id.toString())._id,
        checkInDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        checkOutDate: new Date(new Date().setDate(new Date().getDate() + 8)),
        totalPrice: 120000,
        guestCount: 2,
        guestName: 'John Doe',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        userRef: regularUser._id,
        hotelRef: hotels[1]._id,
        roomRef: rooms.find(r => r.hotelRef.toString() === hotels[1]._id.toString())._id,
        checkInDate: new Date(new Date().setDate(new Date().getDate() - 10)),
        checkOutDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        totalPrice: 30000,
        guestCount: 1,
        guestName: 'Jane Smith',
        status: 'Completed',
        paymentStatus: 'Paid'
      },
      {
         userRef: adminUser._id,
         hotelRef: hotels[3]._id,
         roomRef: rooms.find(r => r.hotelRef.toString() === hotels[3]._id.toString())._id,
         checkInDate: new Date(new Date().setDate(new Date().getDate() + 15)),
         checkOutDate: new Date(new Date().setDate(new Date().getDate() + 20)),
         totalPrice: 90000,
         guestCount: 4,
         guestName: 'Admin Team',
         status: 'Pending',
         paymentStatus: 'Pending'
       }
    ];

    await Booking.insertMany(bookings);

    // Create Dummy Reviews
    const reviews = [
      {
        userRef: regularUser._id,
        hotelRef: hotels[0]._id,
        rating: 5,
        comment: 'Absolutely stunning! The lake view was magical and the service was impeccable.'
      },
      {
        userRef: regularUser._id,
        hotelRef: hotels[1]._id,
        rating: 4,
        comment: 'Great stay, very comfortable beds and nice breakfast.'
      },
      {
         userRef: adminUser._id,
         hotelRef: hotels[4]._id,
         rating: 5,
         comment: 'A true paradise in the mountains. Highly recommended for nature lovers!'
       }
    ];

    await Review.insertMany(reviews);

    // Create Dummy Contact Messages
    const messages = [
      {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        subject: 'Inquiry about group bookings',
        message: 'Hello, I would like to know if you offer discounts for groups of 15 or more people?',
        isRead: false
      },
      {
        name: 'Michael Scott',
        email: 'michael@dundermifflin.com',
        subject: 'Corporate Event Pricing',
        message: 'I am looking to book a conference room and 10 hotel rooms for our annual Dundie awards. Please send me the pricing.',
        isRead: true
      }
    ];

    await ContactMessage.insertMany(messages);

    console.log('Dummy Bookings, Reviews, and Contact Messages Imported!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

seedDummyData();
