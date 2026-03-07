import express from "express";
import jwt from "jsonwebtoken";
import {
  saveEmotion,
  getEmotions,
  getEmotionStats,
} from "./emotion.controller.js";

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mennaalyfahmy");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Apply token verification to all routes
router.use(verifyToken);

// Routes
router.post("/", saveEmotion);
router.get("/", getEmotions);
router.get("/stats", getEmotionStats);

export default router;
