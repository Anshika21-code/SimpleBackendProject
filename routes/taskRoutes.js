import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import requireRole from '../middleware/roleMiddleware.js';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);  // all task routes require login

router.get('/',      getAllTasks);
router.get('/:id',   getTaskById);
router.post('/',     createTask);
router.put('/:id',   updateTask);
router.delete('/:id', requireRole('admin'), deleteTask);

export default router;