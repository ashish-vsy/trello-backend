const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController') 

userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post('/', UserController.createUser);
userRouter.put('/:id', UserController.editUser);
userRouter.delete('/:id', UserController.deleteUser);
userRouter.get('/org/:orgid', UserController.getUserByOrganizationId);

module.exports = userRouter