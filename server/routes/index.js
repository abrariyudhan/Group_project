const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middlewares/authentication.js')
const ProjectRouter = require('./projectRouter.js');

router.use('/projects', authenticate, ProjectRouter)

router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router