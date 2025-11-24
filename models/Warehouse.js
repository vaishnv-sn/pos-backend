import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Warehouse", warehouseSchema);
