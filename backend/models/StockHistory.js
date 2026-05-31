import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    previousQty: { type: Number, required: true },
    newQty: { type: Number, required: true },
    change: { type: Number, required: true },
    reason: { type: String, default: 'manual' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('StockHistory', stockHistorySchema);
