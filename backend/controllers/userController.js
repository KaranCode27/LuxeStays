import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } else {
    return next(new ErrorResponse('User not found', 404));
  }
});

// @desc    Toggle hotel in wishlist
// @route   PUT /api/v1/users/wishlist
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { hotelId } = req.body;

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if hotel is already in wishlist using native string match comparison
  const index = user.wishlist.findIndex(id => id.toString() === hotelId.toString());
  let message = '';

  if (index === -1) {
    // Native Mongoose array modifier to guarantee set uniqueness
    user.wishlist.addToSet(hotelId);
    message = 'Added to wishlist';
  } else {
    // Native Mongoose array modifier to safely pull elements by ID
    user.wishlist.pull(hotelId);
    message = 'Removed from wishlist';
  }

  await user.save();

  // Populate the newly constructed wishlist before returning
  const updatedUser = await User.findById(req.user._id).populate('wishlist', 'name location images pricePerNight starRating');

  res.status(200).json({
    success: true,
    message,
    data: updatedUser.wishlist
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
