import asyncHandler from "../utils/asyncHandler.js";
import Warehouse from "../models/Warehouse.js";
import Tax from "../models/Tax.js";
import Unit from "../models/Unit.js";

/** ----------------------------------------
 * GET ALL WAREHOUSES
 * GET /api/v1/meta/warehouses
 -----------------------------------------*/
export const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().sort({ name: 1 });

  res.status(200).json({
    status: "success",
    results: warehouses.length,
    data: warehouses,
  });
});

/** ----------------------------------------
 * GET ALL TAXES
 * GET /api/v1/meta/taxes
 -----------------------------------------*/
export const getTaxes = asyncHandler(async (req, res) => {
  const taxes = await Tax.find().sort({ rate: 1 });

  res.status(200).json({
    status: "success",
    results: taxes.length,
    data: taxes,
  });
});

/** ----------------------------------------
 * GET ALL UNITS
 * GET /api/v1/meta/units
 -----------------------------------------*/
export const getUnits = asyncHandler(async (req, res) => {
  const units = await Unit.find().sort({ name: 1 });

  res.status(200).json({
    status: "success",
    results: units.length,
    data: units,
  });
});
