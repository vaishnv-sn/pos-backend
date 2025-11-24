import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "ADJUSTMENT", "OPENING"],
      required: true,
    },

    qty: { type: Number, required: true }, // + or -
    unit: { type: String, required: true },

    batch: String,
    serialNumbers: [String],

    referenceId: { type: mongoose.Schema.Types.ObjectId }, // sale/purchase
  },
  { timestamps: true }
);

// Index for fast stock lookup
stockLedgerSchema.index({ materialId: 1, warehouseId: 1 });

export default mongoose.model("StockLedger", stockLedgerSchema);
