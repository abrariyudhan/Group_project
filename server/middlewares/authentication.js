const { User } = require('../models')
const { verifyToken } = require("../helpers/jwt")

module.exports = async function authMiddleware(req, res, next) {
    try {
        console.log(req.headers)

        const { authorization } = req.headers

        if (!authorization) throw { name: "Unauthorized", message: "Please login to access!" }

        const rawToken = authorization.split(' ')
        const tokenType = rawToken[0]
        const tokenValue = rawToken[1]

        if (tokenType !== 'Bearer' || !tokenValue) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }

        const result = verifyToken(tokenValue)

        const user = await User.findByPk(result.id)
        if (!user) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }

        req.user = {
            id: user.id,
            email: user.email
        }

        next()
    } catch (err) {
        next(err)
    }

}
