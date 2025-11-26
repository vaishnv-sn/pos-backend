// /seeders/masterSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import Warehouse from "./models/Warehouse.js";
import Unit from "./models/Unit.js";
import Tax from "./models/Tax.js";
import Category from "./models/Category.js";
import Material from "./models/Material.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB\n");

    // 1. Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      Warehouse.deleteMany({}),
      Unit.deleteMany({}),
      Tax.deleteMany({}),
      Category.deleteMany({}),
      Material.deleteMany({}),
    ]);
    console.log("✅ Data cleared.\n");

    // 2. Seed Warehouses
    console.log("🏭 Seeding Warehouses...");
    const warehouses = await Warehouse.insertMany([
      { name: "Main Godown", address: "123 Main St, Industrial Area" },
      { name: "Shop Rack 1", address: "Shop Floor, Section A" },
      { name: "Cold Storage", address: "456 Cool Rd, Freezer Zone" },
    ]);
    const warehouseMap = warehouses.reduce((acc, w) => {
      acc[w.name] = w._id;
      return acc;
    }, {});
    console.log(`✅ Seeded ${warehouses.length} Warehouses.\n`);

    // 3. Seed Units
    console.log("📏 Seeding Units...");
    const units = await Unit.insertMany([
      { name: "Kilogram", short: "Kg" },
      { name: "Piece", short: "Pcs" },
      { name: "Box", short: "Box" },
      { name: "Litre", short: "Ltr" },
      { name: "Packet", short: "Pkt" },
      { name: "Dozen", short: "Dzn" },
    ]);
    const unitMap = units.reduce((acc, u) => {
      acc[u.short] = u._id;
      return acc;
    }, {});
    console.log(`✅ Seeded ${units.length} Units.\n`);

    // 4. Seed Taxes
    console.log("💰 Seeding Taxes...");
    const taxes = await Tax.insertMany([
      { name: "VAT 5%", rate: 5 },
      { name: "GST 12%", rate: 12 },
      { name: "GST 18%", rate: 18 },
      { name: "Zero Tax", rate: 0 },
    ]);
    const taxMap = taxes.reduce((acc, t) => {
      acc[t.name] = t._id;
      return acc;
    }, {});
    console.log(`✅ Seeded ${taxes.length} Taxes.\n`);

    // 5. Seed Categories
    console.log("📂 Seeding Categories...");
    const categories = await Category.insertMany([
      { name: "MEAT" },
      { name: "SEAFOOD" },
      { name: "FROZEN" },
      { name: "CANNED" },
      { name: "CEREAL" },
      { name: "CONDIMENTS" },
      { name: "BABY PRODUCTS" },
      { name: "PET SUPPLIES" },
      { name: "OFFICE" },
      { name: "OIL" },
      { name: "SMOKE" },
    ]);
    const categoryMap = categories.reduce((acc, c) => {
      acc[c.name] = c._id;
      return acc;
    }, {});
    console.log(`✅ Seeded ${categories.length} Categories.\n`);

    // 6. Seed Materials
    console.log("🧱 Seeding Materials...");
    const materialsData = [
      // MEAT
      {
        name: "Chicken Breast - Boneless",
        hsn: "0207",
        code: "MET001",
        barcode: "8901234567913",
        categoryId: categoryMap["MEAT"],
        unitPrimary: unitMap["Kg"],
        unitSecondary: unitMap["Pcs"],
        conversionFactor: 4,
        purchaseRate: 280,
        retailRate: 350,
        wholesaleRate: 315,
        taxRate: taxMap["VAT 5%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 20, type: "FIXED" },
        warehouseId: warehouseMap["Main Godown"],
        imageUrl: "",
      },
      {
        name: "Mutton - Curry Cut",
        hsn: "0204",
        code: "MET002",
        barcode: "8901234567914",
        categoryId: categoryMap["MEAT"],
        unitPrimary: unitMap["Kg"],
        unitSecondary: unitMap["Pcs"],
        conversionFactor: 1,
        purchaseRate: 550,
        retailRate: 680,
        wholesaleRate: 615,
        taxRate: taxMap["VAT 5%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: false,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 5, type: "PERCENT" },
        warehouseId: warehouseMap["Main Godown"],
        imageUrl: "",
      },
      // SEAFOOD
      {
        name: "Prawns - Large",
        hsn: "0306",
        code: "SEA001",
        barcode: "8901234567916",
        categoryId: categoryMap["SEAFOOD"],
        unitPrimary: unitMap["Kg"],
        unitSecondary: unitMap["Pcs"],
        conversionFactor: 20,
        purchaseRate: 450,
        retailRate: 580,
        wholesaleRate: 515,
        taxRate: taxMap["VAT 5%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 30, type: "FIXED" },
        warehouseId: warehouseMap["Cold Storage"],
        imageUrl: "",
      },
      // FROZEN
      {
        name: "McCain French Fries 1kg",
        hsn: "2004",
        code: "FRZ001",
        barcode: "8901234567919",
        categoryId: categoryMap["FROZEN"],
        unitPrimary: unitMap["Kg"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 10,
        purchaseRate: 150,
        retailRate: 195,
        wholesaleRate: 175,
        taxRate: taxMap["GST 12%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 15, type: "FIXED" },
        warehouseId: warehouseMap["Cold Storage"],
        imageUrl: "",
      },
      // CANNED
      {
        name: "Heinz Baked Beans 415g",
        hsn: "2005",
        code: "CAN001",
        barcode: "8901234567922",
        categoryId: categoryMap["CANNED"],
        unitPrimary: unitMap["Pcs"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 24,
        purchaseRate: 65,
        retailRate: 85,
        wholesaleRate: 75,
        taxRate: taxMap["GST 12%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 7, type: "FIXED" },
        warehouseId: warehouseMap["Shop Rack 1"],
        imageUrl: "",
      },
      // CEREAL
      {
        name: "Kellogg's Corn Flakes 500g",
        hsn: "1904",
        code: "CER001",
        barcode: "8901234567925",
        categoryId: categoryMap["CEREAL"],
        unitPrimary: unitMap["Pcs"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 12,
        purchaseRate: 185,
        retailRate: 240,
        wholesaleRate: 215,
        taxRate: taxMap["GST 12%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: false,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 20, type: "FIXED" },
        warehouseId: warehouseMap["Shop Rack 1"],
        imageUrl: "",
      },
      // CONDIMENTS
      {
        name: "Heinz Tomato Ketchup 500g",
        hsn: "2103",
        code: "CON001",
        barcode: "8901234567928",
        categoryId: categoryMap["CONDIMENTS"],
        unitPrimary: unitMap["Pcs"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 12,
        purchaseRate: 125,
        retailRate: 165,
        wholesaleRate: 145,
        taxRate: taxMap["GST 12%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 12, type: "FIXED" },
        warehouseId: warehouseMap["Shop Rack 1"],
        imageUrl: "",
      },
      // BABY PRODUCTS
      {
        name: "Pampers Baby Diaper Large 54pcs",
        hsn: "9619",
        code: "BAB001",
        barcode: "8901234567931",
        categoryId: categoryMap["BABY PRODUCTS"],
        unitPrimary: unitMap["Pcs"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 4,
        purchaseRate: 850,
        retailRate: 1050,
        wholesaleRate: 950,
        taxRate: taxMap["GST 18%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 50, type: "FIXED" },
        warehouseId: warehouseMap["Main Godown"],
        imageUrl: "",
      },
      // PET SUPPLIES
      {
        name: "Pedigree Adult Dog Food 3kg",
        hsn: "2309",
        code: "PET001",
        barcode: "8901234567934",
        categoryId: categoryMap["PET SUPPLIES"],
        unitPrimary: unitMap["Kg"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 4,
        purchaseRate: 650,
        retailRate: 820,
        wholesaleRate: 735,
        taxRate: taxMap["GST 18%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 40, type: "FIXED" },
        warehouseId: warehouseMap["Main Godown"],
        imageUrl: "",
      },
      // OFFICE
      {
        name: "A4 Paper Ream 500 Sheets",
        hsn: "4802",
        code: "OFF001",
        barcode: "8901234567937",
        categoryId: categoryMap["OFFICE"],
        unitPrimary: unitMap["Pcs"],
        unitSecondary: unitMap["Box"],
        conversionFactor: 5,
        purchaseRate: 240,
        retailRate: 300,
        wholesaleRate: 270,
        taxRate: taxMap["GST 12%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: false,
        batchEnabled: false,
        serialNumberEnabled: false,
        discount: { amount: 20, type: "FIXED" },
        warehouseId: warehouseMap["Shop Rack 1"],
        imageUrl: "",
      },
      // OIL
      {
        name: "Sunflower Oil 1L",
        hsn: "1512",
        code: "OIL001",
        barcode: "8901234567890",
        categoryId: categoryMap["OIL"],
        unitPrimary: unitMap["Ltr"],
        unitSecondary: unitMap["Pcs"],
        conversionFactor: 1,
        purchaseRate: 120,
        retailRate: 150,
        wholesaleRate: 135,
        taxRate: taxMap["VAT 5%"],
        purchaseRateIncludeTax: false,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: false,
        discount: { amount: 5, type: "PERCENT" },
        warehouseId: warehouseMap["Main Godown"],
        imageUrl: "",
      },
      // SMOKE
      {
        name: "Marlboro Red",
        hsn: "2402",
        code: "SMK001",
        barcode: "8901234567893",
        categoryId: categoryMap["SMOKE"],
        unitPrimary: unitMap["Box"],
        unitSecondary: unitMap["Pcs"],
        conversionFactor: 20,
        purchaseRate: 350,
        retailRate: 450,
        wholesaleRate: 400,
        taxRate: taxMap["GST 18%"],
        purchaseRateIncludeTax: true,
        retailRateIncludeTax: true,
        wholesaleRateIncludeTax: true,
        batchEnabled: true,
        serialNumberEnabled: true,
        discount: { amount: 0, type: "PERCENT" },
        warehouseId: warehouseMap["Shop Rack 1"],
        imageUrl: "",
      },
    ];

    await Material.insertMany(materialsData);
    console.log(`✅ Seeded ${materialsData.length} Materials.\n`);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
