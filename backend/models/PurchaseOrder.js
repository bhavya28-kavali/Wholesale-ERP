import mongoose from "mongoose";

const purchaseOrderSchema =
  new mongoose.Schema(
    {
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },

      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },

          quantity: Number,

          costPrice: Number,
        },
      ],

      totalAmount: Number,

      status: {
        type: String,
        enum: [
          "PENDING",
          "RECEIVED"
        ],
        default: "PENDING",
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "PurchaseOrder",
  purchaseOrderSchema
);