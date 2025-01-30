import express from 'express';  
import { VerifyToken } from '../middleware/middleware.js';
const userTaskRelationRouter = express.Router();

import { addUserToTask } from '../controllers/UserTaskRelationController.js';

userTaskRelationRouter.post('/', VerifyToken, addUserToTask);

export { userTaskRelationRouter };
