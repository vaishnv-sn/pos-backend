import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

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
  const { identifier, password } = req.body;

  // Validate required fields
  if (!identifier || !password) {
    return res.status(400).json({
      message: "Email/phone and password are required",
    });
  }

  // Find user by email or phone (case-insensitive for email)
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier },
    ],
    isActive: true,
  });

  // Check if user exists and verify password
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      message: "Invalid email/phone or password",
    });
  }

  // Generate JWT token
  const token = signJwt({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  // Return user object without password
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  res.status(200).json({
    token,
    user: userResponse,
  });
});

export const verify = asyncHandler(async (req, res) => {
  // User is already attached to req.user by requireAuth middleware
  const user = await User.findById(req.user.id).select("-password");

  if (!user || !user.isActive) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  console.log(req.body);
});

export const logout = async (req, res) => {
  res.clearCookie("auth_token", { ...cookieOpts(), maxAge: 0 });
  res.json({ success: true });
};
