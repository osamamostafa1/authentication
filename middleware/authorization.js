const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

// Protect routes
exports.protect = async (req, res, next) => {

    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
        return next({ message: `Not authorize to access this route`, statusCode: 401 })
    }

    // Verify token
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()

    } catch (err) {
        return next({ message: `Not authorize to access this route`, statusCode: 401 })
    }

}

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next({ message: `User role ${req.user.role} is not authorized to access this route`, statusCode: 403 })
        }
        next()
    }
}