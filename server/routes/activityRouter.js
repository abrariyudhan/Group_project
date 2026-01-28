const express = require('express')
const router = express.Router()
const ActivityController = require("../controllers/activityController")

router.get('/:activityId/start', ActivityController.startActivity)

module.exports = router