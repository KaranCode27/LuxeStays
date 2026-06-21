import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Private Routes
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;
