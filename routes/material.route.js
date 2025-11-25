import { Router } from "express";

import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getItems,
  searchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/material.controller.js";

const router = Router();

router.get("/", requireAuth, getItems);
router.get("/search", requireAuth, searchItems);
router.get("/:id", requireAuth, getItemById);
router.post("/", requireAuth, createItem);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);

export default router;
