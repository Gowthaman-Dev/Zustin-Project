// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { scrapeImagesFromUrl } from "./controllers/scraperController.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();
connectdb();

const app = express();

/* =========================
   CORS (PRODUCTION FIX)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://zustin-project.vercel.app",
  "https://zustin-project-q423bfo1u-gowtham-s-projects-c73b1c7e.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Pinterest Clone API is running...");
});

/* =========================
   CLOUDINARY TEST
========================= */
app.get("/test-cloud", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ status: "ok", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/scrape/images", scrapeImagesFromUrl);

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});