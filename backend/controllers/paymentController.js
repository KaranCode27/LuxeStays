import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Invoice from '../models/Invoice.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { createNotification } from './notificationController.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_replace_me',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_replace_me',
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Amount should be in paise
  const amount = booking.totalPrice * 100;

  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${booking._id}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    return next(new ErrorResponse('Failed to create Razorpay order', 500));
  }

  // Save order id to booking
  booking.razorpayOrderId = order.id;
  await booking.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_replace_me')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return next(new ErrorResponse('Invalid signature verification failed', 400));
  }

  // Detect if MongoDB is running in standalone mode (no replica sets)
  let useTransaction = true;
  try {
    const client = mongoose.connection.getClient();
    if (client && client.topology && client.topology.description && client.topology.description.type === 'Single') {
      useTransaction = false;
    }
  } catch (err) {
    useTransaction = true;
  }

  let session = null;
  if (useTransaction) {
    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (sessionErr) {
      useTransaction = false;
      session = null;
    }
  }

  try {
    // Update booking
    const booking = session 
      ? await Booking.findById(bookingId).session(session)
      : await Booking.findById(bookingId);

    if (!booking) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      return next(new ErrorResponse('Booking not found', 404));
    }

    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    
    if (session) {
      await booking.save({ session });
    } else {
      await booking.save();
    }

    // Instantiate and save corresponding Invoice document
    if (session) {
      await Invoice.create([{
        bookingRef: bookingId,
        paymentMethod: 'Razorpay',
        transactionId: razorpay_payment_id,
        amountPaid: booking.totalPrice,
        status: 'Paid'
      }], { session });
    } else {
      await Invoice.create({
        bookingRef: bookingId,
        paymentMethod: 'Razorpay',
        transactionId: razorpay_payment_id,
        amountPaid: booking.totalPrice,
        status: 'Paid'
      });
    }

    // Query hotel name under session to build confirmation string
    const hotel = session 
      ? await Hotel.findById(booking.hotelRef).session(session)
      : await Hotel.findById(booking.hotelRef);

    await createNotification(
      booking.userRef,
      'Booking Confirmed',
      `Your payment of ₹${booking.totalPrice.toLocaleString()} for ${hotel ? hotel.name : 'LuxeStays Property'} has been received. Your booking is confirmed!`
    );

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    // Dispatch booking confirmation email notification (non-blocking)
    try {
      const user = await User.findById(booking.userRef);
      if (user && user.email) {
        const room = await Room.findById(booking.roomRef);
        const pdfBuffer = await generateInvoicePDF(booking, hotel, room, user);

        await sendEmail({
          email: user.email,
          subject: 'Booking Confirmation - LuxeStays',
          message: `Booking Confirmed!\n\nDear ${user.name || 'Valued Guest'},\n\nThank you for choosing LuxeStays. Your booking at ${hotel ? hotel.name : 'LuxeStays Property'} is confirmed!\n\nBooking Details:\n- Hotel: ${hotel ? hotel.name : 'LuxeStays Property'}\n- Location: ${hotel ? hotel.location : 'N/A'}\n- Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}\n- Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}\n- Total Price: ₹${booking.totalPrice.toLocaleString()}\n- Transaction ID: ${razorpay_payment_id}\n\nYou can view and download your full invoice inside your user dashboard.\n\nBest regards,\nThe LuxeStays Team`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #c5a880; font-size: 28px; margin: 0; letter-spacing: 1px;">LUXESTAYS</h1>
                <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Your Luxury Getaway Awaits</p>
              </div>
              
              <h2 style="color: #0f172a; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Booking Confirmed!</h2>
              <p>Dear <strong>${user.name || 'Valued Guest'}</strong>,</p>
              <p>Thank you for choosing LuxeStays. Your booking has been successfully confirmed and your payment was received. We have attached your payment invoice to this email for your records.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">Stay Details:</h4>
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
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Amount Paid:</strong></td>
                    <td style="padding: 6px 0; color: #c5a880; font-size: 14px; font-weight: 600;">₹${booking.totalPrice.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-size: 14px;"><strong>Transaction ID:</strong></td>
                    <td style="padding: 6px 0; font-family: monospace; color: #475569; font-size: 13px;">${razorpay_payment_id}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 14px; color: #475569;">You can access and print your full PDF invoice directly from your LuxeStays dashboard under the <strong>My Invoices</strong> tab.</p>
              <p style="font-size: 14px; color: #475569;">If you need to make changes or have questions about your check-in procedures, feel free to reply to this email or submit a message on our support portal.</p>
              
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
    } catch (emailErr) {
      console.error('Failed to send booking confirmation email:', emailErr);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and invoice created',
    });
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {}
      session.endSession();
    }
    return next(error);
  }
});
