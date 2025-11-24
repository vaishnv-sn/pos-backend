import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  listRoles,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/", requireAuth, createUser);
router.get("/", requireAuth, listUsers);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);
router.get("/roles", requireAuth, listRoles);

export default router;
