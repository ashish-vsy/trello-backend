import express from 'express';  
const taskRouter = express.Router();
import {getAllTasks, getTaskDetailsById , addTask, updateTask, deleteTask} from '../controllers/TaskController.js'

taskRouter.get('/org/:id', getAllTasks);
taskRouter.get('/:id', getTaskDetailsById);
taskRouter.post('/add', addTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export {taskRouter}