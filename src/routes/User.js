import express from 'express';  
const userRouter = express.Router();
import { UserSignUp, userLogin, getAllUsers, getUserById, updateUser, deleteUser, getUserByOrganizationId, changePassword } from '../controllers/UserController.js';


userRouter.post('/signup', UserSignUp);
userRouter.post('/login', userLogin);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.put('/:id', changePassword);
// userRouter.delete('/:id', deleteUser);
userRouter.get('/org/:orgid', getUserByOrganizationId);

export {userRouter}