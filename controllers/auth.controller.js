import jwt from "jsonwebtoken";
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

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "email and password are required" });
  }
  try {
    let [rows] = await pool.query(
      "SELECT u.*, r.name AS role_name, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE LOWER(u.email)=LOWER(?) LIMIT 1",
      [email]
    );
    let user = rows[0];
    // Bootstrap: if user not found or missing password, allow env SUPER_ADMIN to initialize
    const SUPER_EMAIL = process.env.SUPER_ADMIN_EMAIL || "";
    const SUPER_PASS = process.env.SUPER_ADMIN_PASSWORD || "";
    if (
      (!user || !user.password_hash) &&
      SUPER_EMAIL &&
      SUPER_PASS &&
      email.toLowerCase() === SUPER_EMAIL.toLowerCase() &&
      password === SUPER_PASS
    ) {
      const hash = await bcrypt.hash(SUPER_PASS, 10);
      // find role id for super_admin
      const [roleRows] = await pool.query(
        "SELECT id FROM roles WHERE slug = 'super_admin' LIMIT 1"
      );
      const roleId = roleRows[0]?.id || null;
      if (!user) {
        const [ins] = await pool.query(
          "INSERT INTO users (name, email, phone, role_id, is_active, password_hash) VALUES (?, ?, ?, ?, 1, ?)",
          ["Super Admin", SUPER_EMAIL, null, roleId, hash]
        );
        const newId = ins.insertId;
        [rows] = await pool.query(
          "SELECT u.*, r.name AS role_name, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? LIMIT 1",
          [newId]
        );
        user = rows[0];
      } else {
        await pool.query(
          "UPDATE users SET password_hash = ?, role_id = IFNULL(role_id, ?) WHERE id = ?",
          [hash, roleId, user.id]
        );
        [rows] = await pool.query(
          "SELECT u.*, r.name AS role_name, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? LIMIT 1",
          [user.id]
        );
        user = rows[0];
      }
    }
    if (!user || !user.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (!user.password_hash) {
      return res
        .status(401)
        .json({ success: false, message: "Account not initialized" });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = signJwt({
      sub: String(user.id),
      role: user.role_slug || null,
    });
    res.cookie("auth_token", token, cookieOpts());
    return res.json({
      success: true,
      data: {
        id: `user_${user.id}`,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: user.role_name || null,
        profileImageUrl: user.profile_image_url || null,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: err.message });
  }
};

export const me = async (req, res) => {
  const u = req.user;
  if (!u)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const [rows] = await pool.query(
      "SELECT u.*, r.name AS role_name, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? LIMIT 1",
      [u.id]
    );
    const user = rows[0];
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    return res.json({
      success: true,
      data: {
        id: `user_${user.id}`,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: user.role_name || null,
        profileImageUrl: user.profile_image_url || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("auth_token", { ...cookieOpts(), maxAge: 0 });
  res.json({ success: true });
};
