import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  hotelRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required']
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required']
  },
  guestName: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  razorpayOrderId: {
    type: String,
    required: false
  },
  razorpayPaymentId: {
    type: String,
    required: false
  },
  razorpaySignature: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
