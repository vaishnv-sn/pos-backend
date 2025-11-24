import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
  qty: Number,
  unit: String,
  price: Number,
  amount: Number,
  batch: String,
  serialNumbers: [String],
});

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    supplier: String,
    date: { type: Date, default: Date.now },

    items: [purchaseItemSchema],

    totalAmount: Number,
  },
  { timestamps: true }
);

purchaseSchema.index({ invoiceNo: 1 });

export default mongoose.model("Purchase", purchaseSchema);
