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

// Enforce unique review per user per hotel
ReviewSchema.index({ hotelRef: 1, userRef: 1 }, { unique: true });

// Static method to calculate average rating and save it to Hotel model
ReviewSchema.statics.calculateAverageRating = async function(hotelId) {
  const stats = await this.aggregate([
    {
      $match: { hotelRef: hotelId }
    },
    {
      $group: {
        _id: '$hotelRef',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        starRating: Math.round(stats[0].averageRating * 10) / 10 // Round to 1 decimal place (e.g. 4.3)
      });
    } else {
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        starRating: 3 // Default fallback rating if no reviews remain
      });
    }
  } catch (err) {
    console.error('Rating Aggregation Error:', err);
  }
};

// Call calculateAverageRating after save
ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.hotelRef);
});

// Call calculateAverageRating after remove
ReviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.calculateAverageRating(this.hotelRef);
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
