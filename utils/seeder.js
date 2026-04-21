import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxestays')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '0987654321'
  }
];

const hotels = [
  // Udaipur
  {
    name: 'Taj Lake Palace',
    category: 'Luxury',
    location: 'Udaipur, Rajasthan',
    description: 'Experience the regal lifestyle at this stunning white marble palace floating in the middle of Lake Pichola.',
    pricePerNight: 40000,
    amenities: ['Pool', 'Spa', 'Free WiFi', 'Lake View', 'Palace Tour'],
    starRating: 5,
    images: ['/images/hotels/Taj Lake Palace.avif']
  },
  {
    name: 'Trident Udaipur',
    category: 'Mid',
    location: 'Udaipur, Rajasthan',
    description: 'Set in a picturesque location set amidst forty-three acres of lush greenery.',
    pricePerNight: 10000,
    amenities: ['Pool', 'Free WiFi', 'Restaurant', 'Garden View'],
    starRating: 4,
    images: ['/images/hotels/Trident Udaipur.jpg']
  },
  {
    name: 'Hotel Udai Niwas',
    category: 'Budget',
    location: 'Udaipur, Rajasthan',
    description: 'A comfortable stay near the City Palace.',
    pricePerNight: 2500,
    amenities: ['Free WiFi', 'Restaurant', 'City View'],
    starRating: 3,
    images: ['/images/hotels/Hotel Udai Niwas.webp']
  },
  // Manali
  {
    name: 'The Himalayan',
    category: 'Luxury',
    location: 'Manali, Himachal Pradesh',
    description: 'A premium luxury resort offering breathtaking views of the Himalayas.',
    pricePerNight: 18000,
    amenities: ['Pool', 'Spa', 'Mountain View', 'Fireplace', 'Gym'],
    starRating: 5,
    images: ['/images/hotels/The Himalayan.jpg']
  },
  {
    name: 'Solang Valley Resort',
    category: 'Mid',
    location: 'Manali, Himachal Pradesh',
    description: 'Enjoy nature and adventure activities right at your doorstep.',
    pricePerNight: 8000,
    amenities: ['Free WiFi', 'Mountain View', 'Restaurant', 'Adventure Desk'],
    starRating: 4,
    images: ['/images/hotels/Solang Valley Resort.jpg']
  },
  {
    name: 'Hotel Mountain Face',
    category: 'Budget',
    location: 'Manali, Himachal Pradesh',
    description: 'Cozy and affordable stay with stunning mountain vistas.',
    pricePerNight: 2000,
    amenities: ['Free WiFi', 'Restaurant', 'Mountain View'],
    starRating: 3,
    images: ['/images/hotels/Hotel Mountain Face.webp']
  },
  // Kerala
  {
    name: 'The Leela Kovalam',
    category: 'Luxury',
    location: 'Kovalam, Kerala',
    description: 'A clifftop resort with panoramic views of the Kovalam coastline.',
    pricePerNight: 25000,
    amenities: ['Private Beach', 'Infinity Pool', 'Ayurvedic Spa', 'Ocean View'],
    starRating: 5,
    images: ['/images/hotels/The Leela Kovalam.jpg']
  },
  {
    name: 'Taj Bekal Resort',
    category: 'Mid',
    location: 'Bekal, Kerala',
    description: 'A sprawling resort and spa offering backwater experiences.',
    pricePerNight: 12000,
    amenities: ['Pool', 'Spa', 'Backwater View', 'Restaurant'],
    starRating: 4,
    images: ['/images/hotels/Taj Bekal Resort.jpg']
  },
  {
    name: 'Coconut Grove',
    category: 'Budget',
    location: 'Kumarakom, Kerala',
    description: 'A charming retreat enveloped by lush coconut trees and backwaters.',
    pricePerNight: 3000,
    amenities: ['Free WiFi', 'Restaurant', 'Local Tours'],
    starRating: 3,
    images: ['/images/hotels/Coconut Grove.jpg']
  },
  // Ladakh
  {
    name: 'Grand Dragon Ladakh',
    category: 'Luxury',
    location: 'Leh, Ladakh',
    description: 'One of the first luxury hotels in Ladakh, offering modern amenities.',
    pricePerNight: 15000,
    amenities: ['Central Heating', 'Mountain View', 'Restaurant', 'Gym'],
    starRating: 5,
    images: ['/images/hotels/Grand Dragon Ladakh.jpg']
  },
  {
    name: 'The Zen Ladakh',
    category: 'Mid',
    location: 'Leh, Ladakh',
    description: 'A comfortable resort ensuring a warm stay with majestic views.',
    pricePerNight: 7000,
    amenities: ['Heated Pool', 'Free WiFi', 'Restaurant'],
    starRating: 4,
    images: ['/images/hotels/The Zen Ladakh.jpg']
  },
  {
    name: 'Zostel Ladakh',
    category: 'Budget',
    location: 'Leh, Ladakh',
    description: 'A lively backpacker hostel with private rooms and dorms.',
    pricePerNight: 1500,
    amenities: ['Free WiFi', 'Cafe', 'Common Room'],
    starRating: 3,
    images: ['/images/hotels/Zostel Ladakh.jpg']
  },
  // Goa
  {
    name: 'Taj Exotica',
    category: 'Luxury',
    location: 'Benaulim, Goa',
    description: 'A Mediterranean-style resort set within 56 acres of lush gardens.',
    pricePerNight: 22000,
    amenities: ['Private Beach', 'Golf', 'Spa', 'Pool'],
    starRating: 5,
    images: ['/images/hotels/Taj Exotica.jpg']
  },
  {
    name: 'Grand Hyatt Goa',
    category: 'Mid',
    location: 'Bambolim, Goa',
    description: 'A sprawling luxury resort overlooking the waters of Bambolim Bay.',
    pricePerNight: 9000,
    amenities: ['Pool', 'Spa', 'Free WiFi', 'Restaurant'],
    starRating: 4,
    images: ['/images/hotels/Grand Hyatt Goa.jpg']
  },
  {
    name: 'Calangute Residency',
    category: 'Budget',
    location: 'Calangute, Goa',
    description: 'A comfortable government-run resort located right on the popular Calangute beach.',
    pricePerNight: 2200,
    amenities: ['Beachfront', 'Restaurant', 'Free WiFi'],
    starRating: 3,
    images: ['/images/hotels/Calangute Residency.jpg']
  },
  // Jammu & Kashmir
  {
    name: 'Khyber Resort',
    category: 'Luxury',
    location: 'Gulmarg, Jammu & Kashmir',
    description: 'A luxury resort offering majestic views of the Affarwat peaks.',
    pricePerNight: 20000,
    amenities: ['Indoor Pool', 'Spa', 'Skiing', 'Mountain View'],
    starRating: 5,
    images: ['/images/hotels/Khyber Resort.jpg']
  },
  {
    name: 'Vivanta Dal View',
    category: 'Mid',
    location: 'Srinagar, Jammu & Kashmir',
    description: 'A beautiful hotel offering panoramic views of Dal Lake and the Zabarwan Mountains.',
    pricePerNight: 9500,
    amenities: ['Lake View', 'Free WiFi', 'Restaurant', 'Heated Pool'],
    starRating: 4,
    images: ['/images/hotels/Vivanta Dal View.jpg']
  },
  {
    name: 'Hotel Hilltop',
    category: 'Budget',
    location: 'Gulmarg, Jammu & Kashmir',
    description: 'A cozy and affordable stay in the ski resort town of Gulmarg.',
    pricePerNight: 2500,
    amenities: ['Free WiFi', 'Restaurant', 'Mountain View'],
    starRating: 3,
    images: ['/images/hotels/Hotel Hilltop.avif']
  },
  // Uttar Pradesh
  {
    name: 'Oberoi Amarvilas',
    category: 'Luxury',
    location: 'Agra, Uttar Pradesh',
    description: 'Experience unparalleled luxury with uninterrupted views of the Taj Mahal from every room.',
    pricePerNight: 35000,
    amenities: ['Taj Mahal View', 'Pool', 'Spa', 'Fine Dining'],
    starRating: 5,
    images: ['/images/hotels/Oberoi Amarvilas.webp']
  },
  {
    name: 'Taj Hotel Agra',
    category: 'Mid',
    location: 'Agra, Uttar Pradesh',
    description: 'A luxurious retreat set amidst acres of landscaped gardens near the Taj Mahal.',
    pricePerNight: 8500,
    amenities: ['Pool', 'Spa', 'Free WiFi', 'Restaurant'],
    starRating: 4,
    images: ['/images/hotels/Taj Hotel Agra.jpg']
  },
  {
    name: 'Hotel Taj Resorts',
    category: 'Budget',
    location: 'Agra, Uttar Pradesh',
    description: 'A budget-friendly hotel conveniently located within walking distance of the Taj Mahal.',
    pricePerNight: 2000,
    amenities: ['Rooftop Pool', 'Free WiFi', 'Restaurant'],
    starRating: 3,
    images: ['/images/hotels/Hotel Taj Resorts.jpg']
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();

    const createdUsers = await User.create(users);
    
    // Create Hotels
    const createdHotels = await Hotel.insertMany(hotels);

    // Create Rooms for each hotel
    const rooms = [];
    createdHotels.forEach(hotel => {
      rooms.push({
        hotelRef: hotel._id,
        roomNumber: '101',
        type: 'Standard',
        price: hotel.pricePerNight,
        capacity: 2,
        features: ['King Bed', 'City View', 'Mini Bar']
      });
      // Optionally add a suite
      if (hotel.category !== 'Budget') {
        rooms.push({
          hotelRef: hotel._id,
          roomNumber: '201',
          type: 'Suite',
          price: hotel.pricePerNight * 1.5,
          capacity: 4,
          features: ['Two Bedrooms', 'Living Area', 'Premium View']
        });
      }
    });

    await Room.insertMany(rooms);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
