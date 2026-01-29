const { generateProjectTemplate } = require('../helpers/geminiAi');
const { Project, Activity, User, Project_User } = require('../models');

class ProjectController {

    static async createProject(req, res, next) {
        try {
            const userId = req.user.id 
            const { name, description, activities } = req.body 

            if (!name || !description) {
                throw { name: "BadRequest", message: "Name and description are required" }
            }

            const newProject = await Project.create({
                name,
                description,
                status: 'Not Started' // Default status
            })

            await Project_User.create({
                userId: userId,
                projectId: newProject.id
            })

            if (activities && Array.isArray(activities) && activities.length > 0) {
                const activitiesData = activities
                    .filter(task => task.trim() !== '') 
                    .map(task => ({
                        projectId: newProject.id, 
                        todo: task, 
                        todoStatus: 'Not Started' 
                    }));

                if (activitiesData.length > 0) {
                    await Activity.bulkCreate(activitiesData);
                }
            }

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
                    {
                        model: Activity,
                        include: {
                            model: User,
                            attributes: ['id', 'username']
                        }
                    },
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
            const username = req.user.username

            const project = await Project.findByPk(projectId)
            if (!project) throw { name: "NotFound", message: "Project not found" }

            const [membership, created] = await Project_User.findOrCreate({
                where: { projectId, userId }
            })

            if (created) {
                const io = req.app.get('io')
                if (io) {
                    io.to(`project-${projectId}`).emit('taskUpdated', {
                        message: `${username} has joined "${project.name}" project.`
                    })
                }
                return res.status(201).json({ message: "Successfully joined project" })
            } else {
                return res.status(200).json({ message: "You are already a member of this project" })
            }
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

    static async deleteProject(req, res, next) {
        try {
            const { projectId } = req.params 
            const userId = req.user.id 

            const project = await Project.findByPk(projectId)

            if (!project) {
                throw { name: "NotFound", message: "Project not found" }
            }

            const isMember = await Project_User.findOne({
                where: { projectId, userId }
            })

            if (!isMember) {
                throw { name: "Forbidden", message: "You are not authorized to delete this project" }
            }

            await project.destroy()

            res.status(200).json({
                message: "Project successfully deleted",
                deletedProject: project.name
            })
        } catch (err) {
            next(err)
        }
    }

    static async updateProject(req, res, next) {
        try {
            const { projectId } = req.params
            const userId = req.user.id
            const { name, description, status } = req.body


            if (!name || !description) {
                throw { name: "BadRequest", message: "Name and description are required" }
            }

            const project = await Project.findByPk(projectId)

            if (!project) {
                throw { name: "NotFound", message: "Project not found" }
            }

            const isMember = await Project_User.findOne({
                where: { projectId, userId }
            })

            if (!isMember) {
                throw { name: "Forbidden", message: "You are not authorized to edit this project" }
            }

            await project.update({
                name,
                description,
                status: status || project.status 
            })

            res.status(200).json({
                message: "Project successfully updated",
                project
            })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = ProjectController