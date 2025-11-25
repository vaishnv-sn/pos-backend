import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getCategories,
  createCategory,
  searchCategories,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/", getCategories);
router.get("/search", searchCategories);
router.post("/", createCategory);

export default router;
