import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
  name: String,
  qty: Number,
  unit: String,
  price: Number,
  amount: Number,
  taxRate: Number,
  taxAmount: Number,
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },

    customerName: String,
    phone: String,
    barcode: String,

    items: [saleItemSchema],

    totalQty: Number,
    totalTax: Number,
    totalDiscount: Number,
    adjustment: Number,
    totalAmount: Number,
  },
  { timestamps: true }
);

saleSchema.index({ invoiceNo: 1 });

export default mongoose.model("Sale", saleSchema);
