import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: mongoose.Schema.Types.ObjectId
});

export default mongoose.model("Task", taskSchema);