// middlewares/errorHandler.js
import AppError from "../utils/AppError.js";

export default (err, req, res, next) => {
  console.error("🔥 ERROR:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    user: req.user?.id || "unauthenticated",
    timestamp: new Date().toISOString(),
  });

  // If error is not operational → maybe a bug
  if (!err.isOperational) {
    err = new AppError("Something went wrong", 500);
  }

  // Handle mongoose bad ObjectId
  if (err.name === "CastError") {
    err = new AppError("Invalid ID format", 400);
  }

  // Handle missing fields / validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
    err = new AppError(msg, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    err = new AppError("Duplicate field value", 400);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    err = new AppError("Token expired. Please log in again.", 401);
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
