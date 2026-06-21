import Review from '../models/Review.js';
import Hotel from '../models/Hotel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get reviews for a hotel
// @route   GET /api/v1/hotels/:hotelId/reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res, next) => {
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
});

// @desc    Add a review
// @route   POST /api/v1/hotels/:hotelId/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res, next) => {
  req.body.hotelRef = req.params.hotelId;
  req.body.userRef = req.user._id;

  const hotel = await Hotel.findById(req.params.hotelId);

  if (!hotel) {
    return next(new ErrorResponse('Hotel not found', 404));
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Make sure review belongs to user or user is admin
  if (review.userRef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
