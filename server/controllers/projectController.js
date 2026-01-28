const { generateProjectTemplate } = require('../helpers/geminiAi');
const { Project, Activity, User, Project_User } = require('../models');

class ProjectController {

    static async createProject(req, res, next) {
        try {
            const userId = req.user.id
            const { name, description } = req.body

            const newProject = await Project.create({
                name,
                description,
                status: 'Not Started'
            })

            await Project_User.create({
                userId: userId,
                projectId: newProject.id
            })

            res.status(201).json(newProject)
        } catch (err) {
            console.log(err);
            next(err)
        }
    }


    static async getProjects(req, res, next) {
        try {
            const userId = req.user.id

            const projects = await Project.findAll({
                order: [['createdAt', 'DESC']]
            })

            res.status(200).json(projects)
        } catch (err) {
            next(err)
        }
    }

    static async getProjectDetail(req, res, next) {
        try {
            const { projectId } = req.params

            const project = await Project.findByPk(projectId, {
                include: [
                    { model: Activity },
                    {
                        model: User,
                        attributes: ['id', 'email', 'username'],
                        through: { attributes: [] }
                    }
                ]
            })

            if (!project) throw { name: "NotFound", message: "Project not found" }

            res.status(200).json(project)
        } catch (err) {
            next(err)
        }
    }

    static async joinProject(req, res, next) {
        try {
            const { projectId } = req.params
            const userId = req.user.id

            await Project_User.findOrCreate({
                where: { projectId, userId }
            })

            res.status(201).json({ message: "Successfully joined project" })
        } catch (err) {
            next(err)
        }
    }

    static async generateAiProject(req, res, next) {
        try {
            const userId = req.user.id
            const { prompt } = req.body

            if (!prompt) {
                throw { name: "BadRequest", message: "Prompt cannot be empty" };
            }

            const aiData = await generateProjectTemplate(prompt)

            const newProject = await Project.create({
                name: aiData.name,
                description: aiData.description,
                status: 'Not Started'
            })

            await Project_User.create({
                userId: userId,
                projectId: newProject.id
            })

            const activitiesData = aiData.activities.map(task => {
                return {
                    projectId: newProject.id,
                    todo: task,
                    todoStatus: 'Not Started'
                }
            })

            await Activity.bulkCreate(activitiesData)

            res.status(201).json({
                message: "Project successfully created automatically",
                project: newProject
            })

        } catch (err) {
            next(err)
        }
    }

}

module.exports = ProjectController