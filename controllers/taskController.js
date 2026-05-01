import Task from '../models/Task.js';

export const getAllTasks = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const tasks = await Task.find(filter).populate('createdBy', 'name email');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy._id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = await Task.create({ title, description, status, priority, createdBy: req.user.id });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};