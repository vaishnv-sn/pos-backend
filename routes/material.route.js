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
router.post("/", requireAuth, createItem);
router.get("/:id", requireAuth, getItemById);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);
router.get("/search", requireAuth, searchItems);

export default router;
