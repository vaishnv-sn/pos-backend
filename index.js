import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoute from "./routes/auth.route.js";
import usersRoute from "./routes/users.route.js";
import categoryRoute from "./routes/category.route.js";
import materialRoute from "./routes/material.route.js";
import metaRoute from "./routes/meta.route.js";

import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// ----- DB CONNECTION -----

connectDB();

// ----- SECURITY -----
app.use(helmet());
app.use(compression());

// ----- CORS -----
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ----- RATE LIMITING -----
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

// ----- PARSERS -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

// ----- ROUTES -----
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/material", materialRoute);
app.use("/api/v1/meta", metaRoute);

// ----- ERROR HANDLER -----
app.use(errorHandler);

// ----- SERVER START -----
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  mongoose.connection.close();
});
