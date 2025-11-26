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

router.get("/", getItems);
router.post("/", createItem);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/search", searchItems);

export default router;
