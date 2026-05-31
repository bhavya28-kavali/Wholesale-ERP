import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  description: String,
  hsn: { type: String, default: '9983' },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  gstPercent: { type: Number, default: 18 },
  taxableAmount: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  lineTotal: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customerName: { type: String, required: true },
    customerGstin: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    cgstTotal: { type: Number, default: 0 },
    sgstTotal: { type: Number, default: 0 },
    igstTotal: { type: Number, default: 0 },
    gstTotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    placeOfSupply: { type: String, default: 'Maharashtra' },
    isInterState: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);
