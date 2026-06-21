import express from 'express';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyNotifications);

router.route('/read-all')
  .put(markAllNotificationsAsRead);

router.route('/:id/read')
  .put(markNotificationAsRead);

export default router;
