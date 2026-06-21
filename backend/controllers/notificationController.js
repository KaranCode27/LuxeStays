import Notification from '../models/Notification.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get logged in user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ userRef: req.user._id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Ensure message belongs to user
  if (notification.userRef.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to access this notification', 403));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { userRef: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// Reusable Helper to create notification records programmatically
export const createNotification = async (userId, title, message) => {
  try {
    await Notification.create({
      userRef: userId,
      title,
      message
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};
