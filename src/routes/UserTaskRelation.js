const express = require('express');
const userTaskRelationRouter = express.Router();
const UserTaskRelationController = require('../controllers/UserTaskRelationController')


userTaskRelationRouter.post('/', UserTaskRelationController.addUserToTask);

module.exports = userTaskRelationRouter