const { Activity } = require("../models");

class ActivityController {
    static async startActivity(req, res, next) {
            try {
                const { activityId } = req.params
                const activity = await Activity.findByPk(activityId);
                if (!activity) throw { name: "NotFound", message: "Activity not found" }
    
                if (activity.todoStatus === 'On Progress') {
                    throw { name: "BadRequest", message: "This activity is already in progress" }
                }
    
                await activity.update({ todoStatus: 'On Progress' })
    
                res.status(200).json({
                    message: "Started working on the task...",
                    activity
                })
            } catch (err) {
                next(err)
            }
        }
}

module.exports = ActivityController