const express = require('express');
const organizationRouter = express.Router();    

const OrganizationController = require('../controllers/OrganizationController') 

organizationRouter.get('/:id', OrganizationController.getOrganizationById);
organizationRouter.post('/', OrganizationController.addOrganization);
organizationRouter.put('/:id', OrganizationController.editOrganization);

module.exports = organizationRouter