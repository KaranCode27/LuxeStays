import express from 'express';
import {
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  toggleWishlist
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.put('/profile/wishlist', protect, toggleWishlist);

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);

export default router;
