import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { hotelRef, roomRef, checkInDate, checkOutDate, guestCount, guestName } = req.body;

    // Validate hotel and room
    const hotel = await Hotel.findById(hotelRef);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const room = await Room.findById(roomRef);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.hotelRef.toString() !== hotelRef.toString()) {
      return res.status(400).json({ message: 'Room does not belong to this hotel' });
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = Math.abs(checkOut - checkIn);
    const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    // Calculate total price based on room price, guest count, and 10% tax
    const basePrice = nights * room.price * (guestCount || 1);
    const calculatedTotalPrice = basePrice + (basePrice * 0.1);

    const booking = await Booking.create({
      userRef: req.user._id, // from authMiddleware
      hotelRef,
      roomRef,
      checkInDate,
      checkOutDate,
      guestCount,
      totalPrice: calculatedTotalPrice,
      guestName
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/v1/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userRef: req.user._id })
      .populate('hotelRef', 'name location images starRating')
      .populate('roomRef', 'roomNumber type price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userRef', 'name email')
      .populate('hotelRef', 'name')
      .populate('roomRef', 'roomNumber')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userRef', 'firstName lastName email')
      .populate('hotelRef', 'name location')
      .populate('roomRef', 'roomNumber type price');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user is admin OR the user who made the booking
    if (booking.userRef._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status || booking.status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel booking (User)
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userRef.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled',
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
