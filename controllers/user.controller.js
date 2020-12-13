const User = require('../models/User.model')


//@desc     Get all users
//@route    GET /api/vi/auth/users
//@access   Private/Admin
exports.getUsers = async (req, res, next) => {

    try {

        const user = await User.find()
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}


//@desc     Get single user
//@route    GET /api/vi/auth/users/:id
//@access   Private/Admin
exports.getUser = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id)
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}


//@desc     Create user
//@route    POST /api/vi/auth/users
//@access   Private/Admin
exports.createUser = async (req, res, next) => {

    try {

        const user = await User.create(req.body)
        res.status(201).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}


//@desc     Update user
//@route    POST /api/vi/auth/users/:id
//@access   Private/Admin
exports.updateUser = async (req, res, next) => {

    try {

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}


//@desc     Delete user
//@route    DELETE /api/vi/auth/users/:id
//@access   Private/Admin
exports.deleteUser = async (req, res, next) => {

    try {

        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: {} })

    } catch (err) {
        next(err)
    }

}