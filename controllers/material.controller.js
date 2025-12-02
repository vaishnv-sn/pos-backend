import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Material from "../models/Material.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

/* ----------------------------------------------
   GET /api/v1/material?page=1&limit=20&category=ID&lowStock=true
---------------------------------------------- */
export const getItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, lowStock, search } = req.query;

  const query = [];

  // MATCH
  const matchStage = {};

  if (category) matchStage.categoryId = new mongoose.Types.ObjectId(category);

  if (lowStock) matchStage.stockQty = { $lt: 10 };

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
      { hsn: { $regex: search, $options: "i" } },
    ];
  }
  query.push({ $match: matchStage });

  // LOOKUPS
  query.push(
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    {
      $lookup: {
        from: "units",
        localField: "unitPrimary",
        foreignField: "_id",
        as: "unitPrimary",
      },
    },
    { $unwind: "$unitPrimary" },

    {
      $lookup: {
        from: "units",
        localField: "unitSecondary",
        foreignField: "_id",
        as: "unitSecondary",
      },
    },
    { $unwind: { path: "$unitSecondary", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "taxes",
        localField: "taxRate",
        foreignField: "_id",
        as: "tax",
      },
    },
    { $unwind: "$tax" },

    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouse",
      },
    },
    { $unwind: { path: "$warehouse", preserveNullAndEmptyArrays: true } }
  );

  // PROJECT OUTPUT
  query.push({
    $project: {
      name: 1,
      hsn: 1,
      code: 1,
      barcode: 1,
      purchaseRate: 1,
      retailRate: 1,
      wholesaleRate: 1,

      category: "$category.name",
      unitPrimary: "$unitPrimary.name",
      unitSecondary: "$unitSecondary.name",
      conversionFactor: 1,
      warehouse: "$warehouse.name",
      taxRate: "$tax.rate",

      batchEnabled: 1,
      serialNumberEnabled: 1,
      discount: 1,
      imageUrl: 1,
    },
  });

  // PAGINATION
  query.push({ $skip: (page - 1) * limit }, { $limit: Number(limit) });

  const items = await Material.aggregate(query);
  const total = await Material.countDocuments(matchStage);

  res.json({
    success: true,
    data: items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/* ----------------------------------------------
   GET /api/v1/material/barcode/:barcode
---------------------------------------------- */
export const getItemByBarcode = asyncHandler(async (req, res) => {
  const { barcode } = req.params;

  if (!barcode) throw new AppError("Barcode is required", 400);

  const query = [];

  query.push({ $match: { barcode: barcode } });

  query.push(
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    {
      $lookup: {
        from: "units",
        localField: "unitPrimary",
        foreignField: "_id",
        as: "unitPrimary",
      },
    },
    { $unwind: "$unitPrimary" },

    {
      $lookup: {
        from: "units",
        localField: "unitSecondary",
        foreignField: "_id",
        as: "unitSecondary",
      },
    },
    { $unwind: { path: "$unitSecondary", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "taxes",
        localField: "taxRate",
        foreignField: "_id",
        as: "tax",
      },
    },
    { $unwind: "$tax" },

    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouse",
      },
    },
    { $unwind: { path: "$warehouse", preserveNullAndEmptyArrays: true } }
  );

  // PROJECT OUTPUT
  query.push({
    $project: {
      name: 1,
      hsn: 1,
      code: 1,
      barcode: 1,
      purchaseRate: 1,
      retailRate: 1,
      wholesaleRate: 1,

      category: "$category.name",
      unitPrimary: "$unitPrimary.name",
      unitSecondary: "$unitSecondary.name",
      conversionFactor: 1,
      warehouse: "$warehouse.name",
      taxRate: "$tax.rate",

      batchEnabled: 1,
      serialNumberEnabled: 1,
      discount: 1,
      imageUrl: 1,
    },
  });

  const items = await Material.aggregate(query);

  if (!items.length) {
    throw new AppError("Item not found", 404);
  }

  res.json({
    success: true,
    data: items[0],
  });
});

/* ----------------------------------------------
   GET /api/v1/material/search?query=dav
---------------------------------------------- */
export const searchItems = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) throw new AppError("Query is required", 400);

  const results = await Material.find({
    $text: { $search: query },
  }).limit(20);

  return res.json({
    success: true,
    data: results,
  });
});

/* ----------------------------------------------
   GET /api/v1/material/:id
---------------------------------------------- */
export const getItemById = asyncHandler(async (req, res) => {
  const item = await Material.findById(req.params.id);

  if (!item) throw new AppError("Item not found", 404);

  res.json({ success: true, data: item });
});

/* ----------------------------------------------
   POST /api/v1/material
---------------------------------------------- */
export const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    hsn,
    code,
    barcode,
    categoryId,
    unitPrimary,
    unitSecondary,
    conversionFactor,
    purchaseRate,
    retailRate,
    wholesaleRate,
    taxId,
    purchaseRateIncludeTax,
    retailRateIncludeTax,
    wholesaleRateIncludeTax,
    batchEnabled,
    serialNumberEnabled,
    discountType,
    discountAmount,
    warehouseId,
    imageUrl,
  } = req.body;

  if (!name) throw new AppError("Item name is required", 400);
  if (!unitPrimary) throw new AppError("Primary unit is required", 400);

  if (categoryId) {
    const exists = await Category.findById(categoryId);
    if (!exists) throw new AppError("Invalid category ID", 400);
  }

  const newItem = await Material.create({
    name,
    hsn,
    code,
    barcode,
    categoryId,
    unitPrimary,
    unitSecondary,
    conversionFactor,
    purchaseRate,
    retailRate,
    wholesaleRate,
    taxRate: taxId,
    purchaseRateIncludeTax,
    retailRateIncludeTax,
    wholesaleRateIncludeTax,
    batchEnabled,
    serialNumberEnabled,
    discount: {
      amount: discountAmount,
      type: discountType,
    },
    warehouseId,
    imageUrl,
  });

  res.status(201).json({
    success: true,
    data: newItem,
  });
});

/* ----------------------------------------------
   PUT /api/v1/material/:id
---------------------------------------------- */
export const updateItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const item = await Material.findById(itemId);
  if (!item) throw new AppError("Item not found", 404);

  Object.assign(item, req.body);

  const updated = await item.save();

  res.json({
    success: true,
    data: updated,
  });
});

/* ----------------------------------------------
   DELETE /api/v1/material/:id
---------------------------------------------- */
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Material.findById(req.params.id);

  if (!item) throw new AppError("Item not found", 404);

  await item.deleteOne();

  res.json({
    success: true,
    message: "Item deleted successfully",
  });
});
