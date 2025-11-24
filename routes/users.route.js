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

router.get("/users/roles", requireAuth, listRoles);
router.get("/users", requireAuth, listUsers);
router.post("/users", requireAuth, createUser);
router.put("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
