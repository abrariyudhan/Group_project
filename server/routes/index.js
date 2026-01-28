const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middlewares/authentication.js')
const ProjectRouter = require('./projectRouter.js')
const ActivityRouter = require('./activityRouter.js')

router.use('/projects', authenticate, ProjectRouter)
router.use('/activities', authenticate, ActivityRouter)

router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router