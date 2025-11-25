import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const signJwt = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = options.expiresIn || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

const cookieOpts = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const login = asyncHandler(async (req, res) => {
  console.log(req.email, req.password);
});

export const refreshToken = asyncHandler(async (req, res) => {
  console.log(req.body);
});

export const logout = async (req, res) => {
  res.clearCookie("auth_token", { ...cookieOpts(), maxAge: 0 });
  res.json({ success: true });
};
