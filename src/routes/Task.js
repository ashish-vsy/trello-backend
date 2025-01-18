const express = require('express');
const taskRouter = express.Router();
const TaskController = require('../controllers/TaskController')

taskRouter.get('/', TaskController.getAllTasks);
taskRouter.get('/:id', TaskController.getTaskById);
taskRouter.post('/', TaskController.addTask);
taskRouter.put('/:id', TaskController.editTask);
taskRouter.delete('/:id', TaskController.deleteTask);

module.exports = taskRouter