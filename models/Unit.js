import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    short: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Unit", unitSchema);
