import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// @desc    Get rooms
// @route   GET /api/v1/rooms
// @route   GET /api/v1/hotels/:hotelId/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: 'hotelRef',
      select: 'name description'
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add room to hotel
// @route   POST /api/v1/hotels/:hotelId/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    req.body.hotelRef = req.params.hotelId;

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/v1/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/v1/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
