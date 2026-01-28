const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middlewares/authentication.js')
const ProjectRouter = require('./projectRouter.js');


router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use('/projects', authenticate, ProjectRouter)

module.exports = router