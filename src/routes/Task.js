import express from 'express';  
import { VerifyToken } from '../middleware/middleware.js'; 
import { getAllTasks, getTaskDetailsById, addTask, updateTask, deleteTask } from '../controllers/TaskController.js';
import { addUserToTask, getUserTasks } from "../controllers/UserTaskRelationController.js";

const taskRouter = express.Router();

taskRouter.get('/org/:id', VerifyToken, getAllTasks);
taskRouter.get('/:id', VerifyToken, getTaskDetailsById);
taskRouter.post('/add', VerifyToken, addTask);
taskRouter.put('/:id', VerifyToken, updateTask);
taskRouter.delete('/:id', VerifyToken, deleteTask);
taskRouter.get('/assign/:taskid', VerifyToken, getUserTasks);
taskRouter.post('/assign', VerifyToken, addUserToTask);

export { taskRouter };
