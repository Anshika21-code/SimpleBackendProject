import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);  // ← was missing

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});