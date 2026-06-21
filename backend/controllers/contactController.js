import ContactMessage from '../models/ContactMessage.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Submit a contact message
// @route   POST /api/v1/contact
// @access  Public
export const submitMessage = asyncHandler(async (req, res, next) => {
  const message = await ContactMessage.create(req.body);

  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private/Admin
export const getMessages = asyncHandler(async (req, res, next) => {
  const messages = await ContactMessage.find({}).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Delete a message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse('Message not found', 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
