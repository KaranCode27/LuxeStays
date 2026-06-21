import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load env vars

// Connect to Database
import connectDB from './config/db.js';
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Make req.query writable for express-mongo-sanitize in Express 5
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true
  });
  next();
});

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/contact', contactRoutes);

// Register Global Error Handler Middleware
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('LuxeStays API is running...');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
