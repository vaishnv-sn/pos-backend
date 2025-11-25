import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Material from "../models/Material.js";
import Category from "../models/Category.js";

/* ----------------------------------------------
   GET /api/v1/material?page=1&limit=20&category=ID&lowStock=true
---------------------------------------------- */
export const getItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, lowStock, search } = req.query;

  const query = {};

  if (category) query.categoryId = category;

  if (lowStock) {
    query.stockQty = { $lt: 10 };
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Material.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),

    Material.countDocuments(query),
  ]);

  return res.json({
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
