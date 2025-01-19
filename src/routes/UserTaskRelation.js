import express from 'express';  
const userTaskRelationRouter = express.Router();
import {addUserToTask} from '../controllers/UserTaskRelationController.js'


userTaskRelationRouter.post('/', addUserToTask);

export {userTaskRelationRouter}