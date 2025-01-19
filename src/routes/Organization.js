import express from 'express';  
const organizationRouter = express.Router();    

import { getOrganizationById,addOrganization, updateOrganization } from '../controllers/OrganizationController.js';

organizationRouter.get('/:id', getOrganizationById);
organizationRouter.post('/add', addOrganization);
organizationRouter.put('/:id', updateOrganization);

export { organizationRouter}