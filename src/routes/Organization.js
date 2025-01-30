import express from 'express';  
import { getOrganizationById, addOrganization, updateOrganization } from '../controllers/OrganizationController.js';
import { VerifyToken } from '../middleware/middleware.js'; 

const organizationRouter = express.Router();    

organizationRouter.get('/:id', VerifyToken, getOrganizationById);
organizationRouter.post('/add', VerifyToken, addOrganization);
organizationRouter.put('/:id', VerifyToken, updateOrganization);

export { organizationRouter };
