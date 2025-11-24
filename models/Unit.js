import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    conversionFactor: { type: Number, default: 1 }, // secondary → primary
  },
  { timestamps: true }
);

export default mongoose.model("Unit", unitSchema);
