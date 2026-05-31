import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: String,

    email: String,

    gstNumber: String,

    address: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "Supplier",
  supplierSchema
);