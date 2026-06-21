import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get logged in user invoices
// @route   GET /api/v1/invoices/my
// @access  Private
export const getMyInvoices = asyncHandler(async (req, res, next) => {
  // Find bookings of user first
  const bookings = await Booking.find({ userRef: req.user._id }).select('_id');
  const bookingIds = bookings.map(b => b._id);

  const invoices = await Invoice.find({ bookingRef: { $in: bookingIds } })
    .populate({
      path: 'bookingRef',
      populate: {
        path: 'hotelRef',
        select: 'name location images'
      }
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices
  });
});

// @desc    Get all invoices (Admin)
// @route   GET /api/v1/invoices
// @access  Private/Admin
export const getAllInvoices = asyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find()
    .populate({
      path: 'bookingRef',
      populate: [
        { path: 'userRef', select: 'name email' },
        { path: 'hotelRef', select: 'name' }
      ]
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices
  });
});
