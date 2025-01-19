import express from 'express';  
const userRouter = express.Router();
import { UserSignUp, userLogin, getAllUsers, getUserById, editUser, deleteUser, getUserByOrganizationId } from '../controllers/UserController.js';



userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', editUser);
userRouter.delete('/:id', deleteUser);
userRouter.get('/org/:orgid', getUserByOrganizationId);

export {userRouter}