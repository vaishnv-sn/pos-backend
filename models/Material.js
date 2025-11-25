import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    hsn: { type: String, trim: true },
    code: { type: String, trim: true, index: true },
    barcode: { type: String, trim: true, index: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    unitPrimary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    unitSecondary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    conversionFactor: { type: Number, default: 1 },

    purchaseRate: Number,
    retailRate: Number,
    wholesaleRate: Number,

    taxRate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      required: true,
    },
    purchaseRateIncludeTax: { type: Boolean, default: true },
    retailRateIncludeTax: { type: Boolean, default: true },
    wholesaleRateIncludeTax: { type: Boolean, default: true },

    batchEnabled: { type: Boolean, default: false },
    serialNumberEnabled: { type: Boolean, default: false },

    discount: {
      amount: Number,
      type: { type: String, enum: ["PERCENT", "FIXED"] },
    },

    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },

    imageUrl: String,
  },
  { timestamps: true }
);

// Helpful search index
materialSchema.index({ name: "text", barcode: "text", code: "text" });

export default mongoose.model("Material", materialSchema);
