import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 500
  }
}, {
  timestamps: true
});

// Enforce unique review per user per hotel (only 1 review per user for a specific hotel)
ReviewSchema.index({ hotelRef: 1, userRef: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
