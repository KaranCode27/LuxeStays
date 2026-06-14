import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  bookingRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Stripe', 'Bank Transfer'],
    required: [true, 'Payment method is required']
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true // Transaction ID must be absolutely unique
  },
  amountPaid: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
    default: 'Paid'
  }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
export default Invoice;
