import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    unique: true, // ENSURES NO DUPLICATE HOTELS
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add the base price per night']
  },
  category: {
    type: String,
    enum: ['Luxury', 'Mid', 'Budget', 'Standard'],
    default: 'Standard'
  },
  amenities: {
    // Array of strings
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: ['no-photo.jpg']
  },
  starRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating can not be more than 5'],
    default: 3
  }
}, {
  timestamps: true
});

const Hotel = mongoose.model('Hotel', HotelSchema);
export default Hotel;
