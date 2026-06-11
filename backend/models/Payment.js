import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, unique: true, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['cash', 'upi', 'bank_transfer', 'credit_card', 'razorpay'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentDate: { type: Date },
    notes: { type: String, default: '' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
