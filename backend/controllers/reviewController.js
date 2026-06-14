import Review from '../models/Review.js';
import Hotel from '../models/Hotel.js';

// @desc    Get reviews for a hotel
// @route   GET /api/v1/hotels/:hotelId/reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    let query;

    if (req.params.hotelId) {
      query = Review.find({ hotelRef: req.params.hotelId });
    } else {
      query = Review.find().populate({
        path: 'hotelRef',
        select: 'name'
      });
    }

    const reviews = await query.populate('userRef', 'name').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a review
// @route   POST /api/v1/hotels/:hotelId/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    req.body.hotelRef = req.params.hotelId;
    req.body.userRef = req.user._id;

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    // If it's a duplicate due to index
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Make sure review belongs to user or user is admin
    if (review.userRef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
