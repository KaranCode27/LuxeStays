import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// mergeParams: true allows us to access parameters from other routers
// e.g., the hotelId from the hotel router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getRooms)
  .post(protect, admin, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

export default router;
