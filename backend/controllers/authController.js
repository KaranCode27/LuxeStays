import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // First, ask the database if a user with this email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  // Create a new User document
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  if (user) {
    // Create a secure cookie token for the new user
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Successfully registered and logged in!'
    });
  } else {
    return next(new ErrorResponse('Invalid user data provided', 400));
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Find the user.
  const user = await User.findOne({ email }).select('+password').populate('wishlist', 'name location images pricePerNight starRating');

  if (!user) {
    return next(new ErrorResponse('This email is not registered', 401));
  }

  // 2. If user exists, compare password hashes
  if (await user.matchPassword(password)) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      message: 'Login successful'
    });
  } else {
    return next(new ErrorResponse('Incorrect password', 401));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile data
// @route   GET /api/v1/auth/profile
// @access  Private (Needs Token)
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name location images pricePerNight starRating');

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      wishlist: user.wishlist
    });
  } else {
    return next(new ErrorResponse('User not found', 404));
  }
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host') === 'localhost:5000' ? 'localhost:3000' : req.get('host')}/reset-password?token=${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please copy and paste this link in your browser: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'LuxeStays Password Reset Token',
      message,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #1e293b; border-radius: 16px; background-color: #0b0e14; color: #f1f5f9;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c5a880; font-size: 28px; margin: 0; letter-spacing: 2px; font-weight: 700;">LUXESTAYS</h1>
            <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Luxury Hotels & Resorts</p>
          </div>
          
          <div style="background-color: #111522; padding: 25px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 25px;">
            <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; font-weight: 600;">Password Recovery Request</h2>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">We received a request to reset the password associated with your LuxeStays account. Click the button below to establish your new security credentials:</p>
            
            <div style="text-align: center; margin: 35px 0 25px 0;">
              <a href="${resetUrl}" style="background-color: #c5a880; color: #0b0e14; padding: 14px 30px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(197, 168, 128, 0.25); transition: background-color 0.2s;">
                Reset Password
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5;">
            <p style="margin: 0 0 10px 0;"><strong>This recovery link is valid for 10 minutes only.</strong></p>
            <p style="margin: 0;">If you did not request this password reset, please ignore this email or contact support if you suspect unauthorized access.</p>
            <p style="margin: 15px 0 0 0; color: #475569;">&copy; ${new Date().getFullYear()} LuxeStays International. All rights reserved.</p>
          </div>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset password token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Log user in by sending JWT cookie
  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    message: 'Password reset successful and logged in!'
  });
});
