import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a contact message
// @route   POST /api/v1/contact
// @access  Public
export const submitMessage = async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private/Admin
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
