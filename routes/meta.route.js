import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getUnits,
  getTaxes,
  getWarehouses,
} from "../controllers/mata.controller.js";

const router = Router();

router.get("/units", getUnits);
router.get("/taxes", getTaxes);
router.get("/warehouses", getWarehouses);

export default router;
