import express from 'express';
import {
  getReviews,
  addReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .delete(protect, deleteReview);

export default router;
