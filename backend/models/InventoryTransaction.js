import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    previousQty: {
      type: Number,
      required: true,
    },

    newQty: {
      type: Number,
      required: true,
    },

    action: {
      type: String,
      enum: [
        "ORDER_CREATED",
        "ORDER_CANCELLED",
        "ORDER_REOPENED",
        "STOCK_RECEIVED",
        "PRODUCT_UPDATED",
      ],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema
);