import express from 'express';
import { getMyInvoices, getAllInvoices } from '../controllers/invoiceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user invoices
router.get('/my', protect, getMyInvoices);

// Get all invoices (Admin)
router.get('/', protect, admin, getAllInvoices);

export default router;
