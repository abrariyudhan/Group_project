
module.exports = function errorHandler(err, req, res, next) {
    console.log(err);
    
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errorMessages = err.errors.map(el => el.message)
        return res.status(400).json({ message: errorMessages })
    }
    if (err.name === 'BadRequest') {
        return res.status(400).json({ message: err.message })
    }
    if (err.name === 'Unauthorized') {
        return res.status(401).json({ message: err.message })
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" })
    }
    if (err.name === 'Forbidden') {
        return res.status(403).json({ message: "Forbidden access" })
    }
    if (err.name === "NotFound") {
        return res.status(404).json({ message: err.message })
    }
    res.status(500).json({ message: "Internal Server Error" })
}