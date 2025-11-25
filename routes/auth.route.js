import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", requireAuth, refreshToken);

router.post("/logout", logout);

export default router;
