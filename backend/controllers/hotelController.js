import Hotel from '../models/Hotel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
export const getHotels = asyncHandler(async (req, res, next) => {
  let query = {};

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from normal matching
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Parse back to object
  query = JSON.parse(queryStr);

  // Add Server-Side Text Search functionality (utilizing indexes)
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  let mongooseQuery = Hotel.find(query);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Hotel.countDocuments(query);

  mongooseQuery = mongooseQuery.skip(startIndex).limit(limit);

  // Execute query
  const hotels = await mongooseQuery;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: hotels.length,
    pagination,
    data: hotels
  });
});

// @desc    Get single hotel
// @route   GET /api/v1/hotels/:id
// @access  Public
export const getHotelById = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new ErrorResponse('Hotel not found', 404));
  }

  res.status(200).json({
    success: true,
    data: hotel
  });
});

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});

// @desc    Create new hotel
// @route   POST /api/v1/hotels
// @access  Private/Admin
export const createHotel = asyncHandler(async (req, res, next) => {
  // If base64 image data is provided, upload to Cloudinary
  if (req.body.images && req.body.images[0] && req.body.images[0].startsWith('data:image/')) {
    try {
      const result = await cloudinary.uploader.upload(req.body.images[0], {
        folder: 'luxestays_properties',
      });
      req.body.images = [result.secure_url];
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
    }
  }

  const hotel = await Hotel.create(req.body);

  res.status(201).json({
    success: true,
    data: hotel
  });
});

// @desc    Update hotel
// @route   PUT /api/v1/hotels/:id
// @access  Private/Admin
export const updateHotel = asyncHandler(async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new ErrorResponse('Hotel not found', 404));
  }

  // If new base64 image data is provided, upload to Cloudinary
  if (req.body.images && req.body.images[0] && req.body.images[0].startsWith('data:image/')) {
    try {
      const result = await cloudinary.uploader.upload(req.body.images[0], {
        folder: 'luxestays_properties',
      });
      req.body.images = [result.secure_url];
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
    }
  }

  hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: hotel
  });
});

// @desc    Delete hotel
// @route   DELETE /api/v1/hotels/:id
// @access  Private/Admin
export const deleteHotel = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new ErrorResponse('Hotel not found', 404));
  }

  await hotel.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
