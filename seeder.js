// /seeders/masterSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import Warehouse from "./models/Warehouse.js";
import Unit from "./models/Unit.js";
import Tax from "./models/Tax.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB\n");

    /* ------------------------------------ */
    /* 2. WAREHOUSES                        */
    /* ------------------------------------ */
    const warehouses = [
      { name: "Main Godown" },
      { name: "Shop Rack 1" },
      { name: "Shop Rack 2" },
    ];

    for (const wh of warehouses) {
      await Warehouse.updateOne({ name: wh.name }, wh, { upsert: true });
    }
    console.log("⭐ Warehouses seeded");

    /* ------------------------------------ */
    /* 3. UNIT MASTER                       */
    /* ------------------------------------ */
    const units = [
      { name: "Box" },
      { name: "Piece" },
      { name: "Kg" },
      { name: "Litre" },
    ];

    for (const unit of units) {
      await Unit.updateOne({ name: unit.name }, unit, { upsert: true });
    }
    console.log("⭐ Units seeded");

    /* ------------------------------------ */
    /* 4. TAX MASTER                        */
    /* ------------------------------------ */
    const taxes = [
      { name: "VAT 5%", rate: 5 },
      { name: "VAT 10%", rate: 10 },
      { name: "GST 12%", rate: 12 },
      { name: "GST 18%", rate: 18 },
    ];

    for (const tax of taxes) {
      await Tax.updateOne({ rate: tax.rate }, tax, { upsert: true });
    }
    console.log("⭐ Taxes seeded");

    console.log("\n🎉 Master data seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
};

seed();
