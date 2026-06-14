import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import roomRouter from './roomRoutes.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:hotelId/rooms', roomRouter);
router.use('/:hotelId/reviews', reviewRouter);

router.route('/')
  .get(getHotels)
  .post(protect, admin, createHotel);

router.route('/:id')
  .get(getHotelById)
  .put(protect, admin, updateHotel)
  .delete(protect, admin, deleteHotel);

export default router;
