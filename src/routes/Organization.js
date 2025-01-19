import express from 'express';  
const organizationRouter = express.Router();    

import { getOrganizationById,addOrganization,editOrganization } from '../controllers/OrganizationController.js';

organizationRouter.get('/:id', getOrganizationById);
organizationRouter.post('/', addOrganization);
organizationRouter.put('/:id', editOrganization);

export { organizationRouter}