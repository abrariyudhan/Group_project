const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middlewares/authentication.js')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router