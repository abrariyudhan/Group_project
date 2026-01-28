const { generateProjectTemplate } = require('../helpers/geminiAi');
const { Project, Activity, User, Project_User } = require('../models');

class ProjectController {

    static async createProject(req, res, next) {
    try {
        const userId = req.user.id // Ambil userId dari middleware authentication
        const { name, description, activities } = req.body // Destructure data dari request body

        // Validasi input - name dan description wajib ada
        if (!name || !description) {
            throw { name: "BadRequest", message: "Name and description are required" }
        }

        // 1. Buat project baru di database
        const newProject = await Project.create({
            name,
            description,
            status: 'Not Started' // Default status
        })

        // 2. Hubungkan user dengan project (many-to-many relationship)
        await Project_User.create({
            userId: userId,
            projectId: newProject.id
        })

        // 3. Buat activities jika ada
        if (activities && Array.isArray(activities) && activities.length > 0) {
            // Filter: hapus activity yang kosong (hanya whitespace)
            const activitiesData = activities
                .filter(task => task.trim() !== '') // trim() = hapus whitespace
                .map(task => ({
                    projectId: newProject.id, // FK ke project yang baru dibuat
                    todo: task, // Isi activity
                    todoStatus: 'Not Started' // Default status activity
                }));

            // Buat multiple activities sekaligus jika ada data
            if (activitiesData.length > 0) {
                await Activity.bulkCreate(activitiesData);
                // bulkCreate = insert multiple rows sekaligus (lebih efisien dari looping create)
            }
        }

        res.status(201).json(newProject) // Return project yang baru dibuat
    } catch (err) {
        console.log(err);
        next(err) // Pass error ke error handler middleware
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
                        attributes: ['id', 'email'],
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

        static async deleteProject(req, res, next) {
        try {
            const { projectId } = req.params // Ambil projectId dari URL parameter
            const userId = req.user.id // Ambil userId dari authentication

            // 1. Cari project berdasarkan ID
            const project = await Project.findByPk(projectId)

            // 2. Validasi: apakah project ada?
            if (!project) {
                throw { name: "NotFound", message: "Project not found" }
            }

            // 3. Opsional: Validasi apakah user adalah member dari project
            // (Jika ingin hanya member yang bisa delete)
            const isMember = await Project_User.findOne({
                where: { projectId, userId }
            })

            if (!isMember) {
                throw { name: "Forbidden", message: "You are not authorized to delete this project" }
            }

            // 4. Delete project (akan otomatis delete activities karena CASCADE)
            await project.destroy()

            // 5. Response success
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

            // 1. Validasi input
            if (!name || !description) {
                throw { name: "BadRequest", message: "Name and description are required" }
            }

            // 2. Cari project berdasarkan ID
            const project = await Project.findByPk(projectId)

            if (!project) {
                throw { name: "NotFound", message: "Project not found" }
            }

            // 3. Validasi: apakah user adalah member dari project
            const isMember = await Project_User.findOne({
                where: { projectId, userId }
            })

            if (!isMember) {
                throw { name: "Forbidden", message: "You are not authorized to edit this project" }
            }

            // 4. Update project
            await project.update({
                name,
                description,
                status: status || project.status // Gunakan status baru atau tetap gunakan yang lama
            })

            // 5. Response dengan data yang sudah diupdate
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