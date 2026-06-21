import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res, next) => {
  const { hotelRef, roomRef, checkInDate, checkOutDate, guestCount, guestName } = req.body;

  // Validate hotel and room
  const hotel = await Hotel.findById(hotelRef);
  if (!hotel) return next(new ErrorResponse('Hotel not found', 404));

  const room = await Room.findById(roomRef);
  if (!room) return next(new ErrorResponse('Room not found', 404));

  if (room.hotelRef.toString() !== hotelRef.toString()) {
    return next(new ErrorResponse('Room does not belong to this hotel', 400));
  }

  // Calculate nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return next(new ErrorResponse('Please provide valid check-in and check-out dates', 400));
  }

  const timeDifference = checkOut - checkIn;
  const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    return next(new ErrorResponse('Check-out date must be after check-in date', 400));
  }

  // Check for date overlap collisions (Double Bookings)
  const overlappingBooking = await Booking.findOne({
    roomRef,
    status: { $in: ['Pending', 'Confirmed'] }, // Only check active bookings
    $or: [
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
      }
    ]
  });

  if (overlappingBooking) {
    return next(new ErrorResponse('The selected room is already booked for these dates', 400));
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

  // Dynamic user notification alert
  await createNotification(
    req.user._id,
    'Booking Created',
    `Your stay at ${hotel.name} has been initiated and is pending payment.`
  );

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get logged in user bookings
// @route   GET /api/v1/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ userRef: req.user._id })
    .populate('hotelRef', 'name location images starRating')
    .populate('roomRef', 'roomNumber type price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res, next) => {
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
});

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('userRef', 'name email')
    .populate('hotelRef', 'name location')
    .populate('roomRef', 'roomNumber type price');

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Ensure user is admin OR the user who made the booking
  if (booking.userRef._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this booking', 403));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  const oldStatus = booking.status;
  const newStatus = req.body.status || booking.status;
  booking.status = newStatus;

  // If status is changed to Confirmed, ensure paymentStatus is Paid
  if (newStatus === 'Confirmed') {
    booking.paymentStatus = 'Paid';
  }

  await booking.save();

  // If status was changed to Confirmed, send confirmation email
  if (oldStatus !== 'Confirmed' && newStatus === 'Confirmed') {
    try {
      // Ensure corresponding Invoice exists
      let invoice = await Invoice.findOne({ bookingRef: booking._id });
      if (!invoice) {
        invoice = await Invoice.create({
          bookingRef: booking._id,
          paymentMethod: 'Razorpay',
          transactionId: `MAN-${booking._id.toString().substring(0, 8).toUpperCase()}`,
          amountPaid: booking.totalPrice,
          status: 'Paid'
        });
      }

      const user = await User.findById(booking.userRef);
      const hotel = await Hotel.findById(booking.hotelRef);
      if (user && user.email) {
        const room = await Room.findById(booking.roomRef);
        const pdfBuffer = await generateInvoicePDF(booking, hotel, room, user);

        await sendEmail({
          email: user.email,
          subject: 'Booking Confirmed - LuxeStays',
          message: `Booking Confirmed!\n\nDear ${user.name || 'Valued Guest'},\n\nYour booking at ${hotel ? hotel.name : 'LuxeStays Property'} has been confirmed by the administration!\n\nStay Details:\n- Hotel: ${hotel ? hotel.name : 'LuxeStays Property'}\n- Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}\n- Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}\n- Total Price: ₹${booking.totalPrice.toLocaleString()}\n\nThank you for choosing LuxeStays!\n\nBest regards,\nThe LuxeStays Team`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #c5a880; font-size: 28px; margin: 0; letter-spacing: 1px;">LUXESTAYS</h1>
                <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Your Luxury Getaway Awaits</p>
              </div>
              <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Reservation Confirmed</h2>
              <p>Dear <strong>${user.name || 'Valued Guest'}</strong>,</p>
              <p>We are pleased to inform you that your reservation at <strong>${hotel ? hotel.name : 'LuxeStays Property'}</strong> has been confirmed by our booking administration. We have attached your payment invoice to this email for your records.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">Stay Summary:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 35%;"><strong>Hotel:</strong></td>
                    <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${hotel ? hotel.name : 'LuxeStays Property'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Location:</strong></td>
                    <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${hotel ? hotel.location : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Check-in:</strong></td>
                    <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${new Date(booking.checkInDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Check-out:</strong></td>
                    <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Total Price:</strong></td>
                    <td style="padding: 6px 0; color: #c5a880; font-size: 14px; font-weight: 600;">₹${booking.totalPrice.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              <p style="font-size: 14px; color: #475569;">You can manage your booking and check stay guidelines inside your account dashboard.</p>
              
              <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 13px; color: #64748b;">
                <p style="margin: 0;">Warm regards,</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; color: #0f172a;">The LuxeStays Team</p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `invoice_${booking._id.toString().substring(0, 8).toUpperCase()}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        });
      }
    } catch (err) {
      console.error('Failed to send status update confirmation email:', err);
    }
  }

  // If status was changed to Cancelled, send cancellation email
  if (oldStatus !== 'Cancelled' && newStatus === 'Cancelled') {
    try {
      const user = await User.findById(booking.userRef);
      const hotel = await Hotel.findById(booking.hotelRef);
      if (user && user.email) {
        await sendEmail({
          email: user.email,
          subject: 'Booking Cancelled - LuxeStays',
          message: `Booking Cancelled\n\nDear ${user.name || 'Valued Guest'},\n\nYour reservation at ${hotel ? hotel.name : 'LuxeStays Property'} has been cancelled.\n\nBest regards,\nThe LuxeStays Team`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #c5a880; font-size: 28px; margin: 0; letter-spacing: 1px;">LUXESTAYS</h1>
              </div>
              <h2 style="color: #ef4444; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Reservation Cancelled</h2>
              <p>Dear <strong>${user.name || 'Valued Guest'}</strong>,</p>
              <p>Your reservation at <strong>${hotel ? hotel.name : 'LuxeStays Property'}</strong> has been successfully cancelled as per your request or administrative actions.</p>
              <p style="font-size: 14px; color: #475569;">If this cancellation was unintended, please reach out to our helpdesk.</p>
              <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 13px; color: #64748b;">
                <p style="margin: 0;">Warm regards,</p>
                <p style="margin: 5px 0 0 0; font-weight: 600; color: #0f172a;">The LuxeStays Team</p>
              </div>
            </div>
          `
        });
      }
    } catch (err) {
      console.error('Failed to send status update cancellation email:', err);
    }
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking (User)
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  if (booking.userRef.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to cancel this booking', 403));
  }

  if (booking.status === 'Cancelled') {
    return next(new ErrorResponse('Booking is already cancelled', 400));
  }

  booking.status = 'Cancelled';
  await booking.save();

  const hotel = await Hotel.findById(booking.hotelRef);
  await createNotification(
    booking.userRef,
    'Booking Cancelled',
    `Your stay at ${hotel ? hotel.name : 'LuxeStays Property'} has been successfully cancelled.`
  );

  // Send cancellation email (non-blocking)
  try {
    const user = await User.findById(booking.userRef);
    if (user && user.email) {
      await sendEmail({
        email: user.email,
        subject: 'Booking Cancelled - LuxeStays',
        message: `Booking Cancelled\n\nDear ${user.name || 'Valued Guest'},\n\nYour reservation at ${hotel ? hotel.name : 'LuxeStays Property'} has been cancelled.\n\nBest regards,\nThe LuxeStays Team`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #c5a880; font-size: 28px; margin: 0; letter-spacing: 1px;">LUXESTAYS</h1>
            </div>
            <h2 style="color: #ef4444; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Reservation Cancelled</h2>
            <p>Dear <strong>${user.name || 'Valued Guest'}</strong>,</p>
            <p>Your reservation at <strong>${hotel ? hotel.name : 'LuxeStays Property'}</strong> has been successfully cancelled.</p>
            <p style="font-size: 14px; color: #475569;">If this cancellation was unintended, please contact our support team immediately.</p>
            <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 13px; color: #64748b;">
              <p style="margin: 0;">Warm regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: 600; color: #0f172a;">The LuxeStays Team</p>
            </div>
          </div>
        `
      });
    }
  } catch (err) {
    console.error('Failed to send cancellation email:', err);
  }

  res.status(200).json({
    success: true,
    message: 'Booking successfully cancelled',
    data: booking
  });
});
