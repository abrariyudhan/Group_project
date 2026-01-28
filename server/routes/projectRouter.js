const express = require('express')
const router = express.Router()
const ProjectController = require("../controllers/projectController")

router.get('/', ProjectController.getProjects)
router.post('/', ProjectController.createProject)
router.post('/generate-ai', ProjectController.generateAiProject)
router.get('/:projectId', ProjectController.getProjectDetail)

module.exports = router