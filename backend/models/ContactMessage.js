import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name']
  },
  email: {
    type: String,
    required: [true, 'Please add your email']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  message: {
    type: String,
    required: [true, 'Message content cannot be empty']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
export default ContactMessage;
