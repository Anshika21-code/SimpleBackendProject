import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());

//   Routes
app.use("/api/auth", authRoutes);

//  DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" DB connected"))
  .catch((err) => {
    console.error(" DB connection error:", err.message);
    process.exit(1);
  });

// Default Route (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});