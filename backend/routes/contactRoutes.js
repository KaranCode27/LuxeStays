import express from 'express';
import { submitMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitMessage)
  .get(protect, admin, getMessages);

router.route('/:id')
  .delete(protect, admin, deleteMessage);

export default router;
