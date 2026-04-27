import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => console.log("Connected to MongoDB ATLAS"))
  .catch((err) => console.error("MongoDB ATLAS connection error:", err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Only serve static files in production

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}
// Import routes
import userRouter from "./src/modules/user/user.router.js";

import emotionRouter from "./src/modules/emotion/emotion.router.js";
import journalRouter from "./src/modules/journal/journal.router.js";

app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});
// API Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// User routes
app.use("/api/users", userRouter);

// Emotion routes
app.use("/api/emotions", emotionRouter);

// Journal routes
app.use("/api/journals", journalRouter);

// Serve static files from the React app (production only)
if (process.env.NODE_ENV === "production") {
  app.get((req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
