import { Router } from "express";
import { login, logout, refreshToken, verify } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/verify", requireAuth, verify);
router.post("/refresh", requireAuth, refreshToken);

router.post("/logout", logout);

export default router;
