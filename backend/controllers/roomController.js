import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get rooms
// @route   GET /api/v1/rooms
// @route   GET /api/v1/hotels/:hotelId/rooms
// @access  Public
export const getRooms = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.hotelId) {
    query = Room.find({ hotelRef: req.params.hotelId });
  } else {
    query = Room.find().populate({
      path: 'hotelRef',
      select: 'name location'
    });
  }

  const rooms = await query;

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
export const getRoomById = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate({
    path: 'hotelRef',
    select: 'name description'
  });

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Add room to hotel
// @route   POST /api/v1/hotels/:hotelId/rooms
// @access  Private/Admin
export const createRoom = asyncHandler(async (req, res, next) => {
  req.body.hotelRef = req.params.hotelId;

  const hotel = await Hotel.findById(req.params.hotelId);

  if (!hotel) {
    return next(new ErrorResponse('Hotel not found', 404));
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    data: room
  });
});

// @desc    Update room
// @route   PUT /api/v1/rooms/:id
// @access  Private/Admin
export const updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Delete room
// @route   DELETE /api/v1/rooms/:id
// @access  Private/Admin
export const deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  await room.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
