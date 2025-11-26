import asyncHandler from "../utils/asyncHandler.js";
import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";

export const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {};

  const totalCount = await Category.countDocuments(searchQuery);

  const categories = await Category.find(searchQuery)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);

  const hasMore = skip + categories.length < totalCount;
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasMore,
      currentCount: categories.length,
    },
  });
});

export const searchCategories = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    throw new AppError("Search query is required", 400);
  }

  const categories = await Category.find({
    name: { $regex: query, $options: "i" },
  }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    results: categories.length,
    data: categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new AppError("Category name is required", 400);
  }

  const exists = await Category.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (exists) {
    throw new AppError("Category already exists", 409);
  }

  const newCategory = await Category.create({ name });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});
