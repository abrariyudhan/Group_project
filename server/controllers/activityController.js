const { Activity, Project_User } = require("../models");

class ActivityController {
    static async updateStatus(req, res, next) {
        try {
            const { activityId } = req.params
            const { todoStatus } = req.body
            const userId = req.user.id

            const activity = await Activity.findByPk(activityId)
            if (!activity) throw { name: "NotFound", message: "Activity not found" }
            
            const isMember = await Project_User.findOne({
                where: { projectId: activity.projectId, userId: userId }
            })
            
            if (!isMember) {
                throw { name: "Forbidden", message: "You must join this project to update tasks" }
            }
            
            if (activity.todoStatus === 'Done') {
                throw { name: "BadRequest", message: "Activity already completed" }
            }

            await activity.update({ todoStatus })

            res.status(200).json({
                message: `Activity updated to ${todoStatus}`,
                activity
            })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = ActivityController