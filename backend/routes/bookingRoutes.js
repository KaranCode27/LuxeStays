import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define /my specifically before /:id so it doesn't get treated as an ID
router.route('/my')
  .get(protect, getMyBookings);

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

export default router;
