import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Example: "VAT 10%", "GST 5%"
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // percentage
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tax", taxSchema);
