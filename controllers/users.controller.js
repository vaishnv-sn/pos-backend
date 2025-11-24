import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const listRoles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, slug, is_active FROM roles ORDER BY id"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch roles",
        error: err.message,
      });
  }
};

export const listUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.profile_image_url, u.role_id, u.is_active,
              u.created_at, r.name AS role_name, r.slug AS role_slug
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch users",
        error: err.message,
      });
  }
};

export const createUser = async (req, res) => {
  const {
    name,
    email,
    phone = null,
    roleId = null,
    isActive = 1,
    password = null,
    profileImageUrl = null,
  } = req.body || {};
  if (!name || !email)
    return res
      .status(400)
      .json({ success: false, message: "name and email are required" });
  if (!password || String(password).trim().length < 6)
    return res
      .status(400)
      .json({ success: false, message: "password is required (min 6 chars)" });
  try {
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const [r] = await pool.query(
      `INSERT INTO users (name, email, phone, role_id, is_active, password_hash, profile_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, roleId, isActive ? 1 : 0, hash, profileImageUrl]
    );
    const id = r.insertId;
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.profile_image_url, u.role_id, u.is_active, u.created_at,
              r.name AS role_name, r.slug AS role_slug
       FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ?`,
      [id]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ success: false, message: "Email or phone already exists" });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create user",
        error: err.message,
      });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    roleId,
    isActive,
    is_active,
    password,
    profileImageUrl,
  } = req.body || {};
  try {
    // prevent update of super_admin user, except allowing self password change
    const [found] = await pool.query(
      `SELECT u.id, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? LIMIT 1`,
      [id]
    );
    const target = found[0];
    const isSuperAdmin =
      (target?.role_slug || "").toLowerCase() === "super_admin";
    const isSelf = req.user && String(req.user.id) === String(id);

    if (isSuperAdmin && !isSelf) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot modify super admin" });
    }
    const sets = [];
    const vals = [];
    if (!isSuperAdmin) {
      if (name !== undefined) {
        sets.push("name = ?");
        vals.push(name);
      }
      if (email !== undefined) {
        sets.push("email = ?");
        vals.push(email);
      }
      if (phone !== undefined) {
        sets.push("phone = ?");
        vals.push(phone);
      }
      if (roleId !== undefined) {
        sets.push("role_id = ?");
        vals.push(roleId);
      }
      const activeVal = isActive !== undefined ? isActive : is_active;
      if (activeVal !== undefined) {
        sets.push("is_active = ?");
        vals.push(activeVal ? 1 : 0);
      }
      if (profileImageUrl !== undefined) {
        sets.push("profile_image_url = ?");
        vals.push(profileImageUrl);
      }
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      sets.push("password_hash = ?");
      vals.push(hash);
    }
    if (!sets.length) return res.json({ success: true });
    await pool.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, [
      ...vals,
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ success: false, message: "Email or phone already exists" });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update user",
        error: err.message,
      });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // prevent delete/disable of super_admin user
    const [found] = await pool.query(
      `SELECT u.id, r.slug AS role_slug FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.id = ? LIMIT 1`,
      [id]
    );
    if (found[0]?.role_slug === "super_admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot disable super admin" });
    }
    await pool.query(
      `UPDATE users SET is_active = 0, deleted_at = NOW() WHERE id = ?`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete user",
        error: err.message,
      });
  }
};
