import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from '../controllers/authController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private Routes
// Notice how we use the `protect` middleware first. If `protect` fails, it blocks `logoutUser` or `getUserProfile` from running!
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;
