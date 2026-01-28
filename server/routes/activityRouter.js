const express = require('express')
const router = express.Router()
const ActivityController = require("../controllers/activityController")

router.patch('/:activityId', ActivityController.updateStatus)

module.exports = router