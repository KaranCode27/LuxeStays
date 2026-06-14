import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  hotelRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number']
  },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    required: [true, 'Please add a room type']
  },
  price: {
    type: Number,
    required: [true, 'Please add price for the room']
  },
  capacity: {
    type: Number,
    required: [true, 'Please specific room capacity']
  },
  features: {
    type: [String],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent duplicate room numbers in the same hotel
RoomSchema.index({ hotelRef: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model('Room', RoomSchema);
export default Room;
