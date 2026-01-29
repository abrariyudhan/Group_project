const express = require('express')
const router = express.Router()
const ProjectController = require("../controllers/projectController")

router.get('/', ProjectController.getProjects)
router.post('/', ProjectController.createProject)
router.post('/generate-ai', ProjectController.generateAiProject)
router.post('/:projectId/join', ProjectController.joinProject)
router.patch('/:projectId/status', ProjectController.updateProjectStatus)
router.get('/:projectId', ProjectController.getProjectDetail)
router.put('/:projectId', ProjectController.updateProject)
router.delete('/:projectId', ProjectController.deleteProject)

module.exports = router