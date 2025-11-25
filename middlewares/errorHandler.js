// middlewares/errorHandler.js
import AppError from "../utils/AppError.js";

export default function errorHandler(err, req, res, next) {
  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    user: req.user?.id || "unauthenticated",
    timestamp: new Date().toISOString(),
  });

  // 1️⃣ Convert unknown errors to operational ones
  if (!err.isOperational) {
    err = new AppError("Something went wrong", 500);
  }

  // 2️⃣ Mongoose invalid ObjectId
  if (err.name === "CastError") {
    err = new AppError("Invalid ID format", 400);
  }

  // 3️⃣ Mongoose validation errors
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
    err = new AppError(msg, 400);
  }

  // 4️⃣ MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field} already exists`, 409);
  }

  // 5️⃣ JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    err = new AppError("Token expired. Please log in again.", 401);
  }

  // 6️⃣ Final safe response
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message,
  });
}
