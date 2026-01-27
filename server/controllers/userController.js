const { signToken } = require('../helpers/jwt.js')
const { comparePassword } = require('../helpers/bcrypt.js')
const { User } = require('../models')

class Controller {
    static async register(req, res, next) {
        try {
            const { email, password, role } = req.body
            const newUser = await User.create({ email, password, role })
            res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role })
        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw { name: "BadRequest", message: "Email and Password are required" }
            }
            const user = await User.findOne({ where: { email } })
            if (!user) {
                throw { name: "Unauthorized", message: "Invalid email or password" }
            }
            const isValidPassword = comparePassword(password, user.password)
            if (!isValidPassword) {
                throw { name: "Unauthorized", message: "Invalid email or password" }
            }
            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = Controller