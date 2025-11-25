import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getCategories,
  createCategory,
  searchCategories,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/", requireAuth, getCategories);
router.get("/search", requireAuth, searchCategories);
router.post("/", requireAuth, createCategory);

export default router;
