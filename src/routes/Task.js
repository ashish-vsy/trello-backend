import express from 'express';  
const taskRouter = express.Router();
import {getAllTasks, getTaskById , addTask, editTask, deleteTask} from '../controllers/TaskController.js'

taskRouter.get('/', getAllTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', addTask);
taskRouter.put('/:id', editTask);
taskRouter.delete('/:id', deleteTask);

export {taskRouter}