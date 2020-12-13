const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const User = require('../models/User.model')


//@desc     Register user
//@route    POST /api/vi/auth/register
//@access   Public
exports.register = async (req, res, next) => {

    try {

        const { name, email, password, role } = req.body
        // create user
        const user = await User.create({ name, email, password, role })
        sendTokenResponse(user, 200, res)

    } catch (err) {
        next(err)
    }

}


//@desc     Login user
//@route    POST /api/vi/auth/login
//@access   Public
exports.login = async (req, res, next) => {

    try {

        const { email, password } = req.body

        // Validate email & password
        if (!email || !password) {
            return next({ message: 'Please provide an email and password', statusCode: 400 })
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return next({ message: `Invalid credentials`, statusCode: 401 })
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return next({ message: `Invalid credentials`, statusCode: 401 })
        }

        sendTokenResponse(user, 200, res)

    } catch (err) {
        next(err)
    }
}


//@desc     Get current logged in user
//@route    GET /api/vi/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id)
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}

//@desc     Update user details
//@route    PUT /api/vi/auth/user
//@access   Private
exports.UpdateDetails = async (req, res, next) => {
    try {

        const fieldeToUpdate = {
            name: req.body.name,
            email: req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldeToUpdate, {
            new: true,
            runValidators: true
        })
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }

}


//@desc     Update Password
//@route    PUT /api/vi/auth/updatepassword
//@access   Private
exports.UpdatePassword = async (req, res, next) => {
    try {

        const fieldeToUpdate = {
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword
        }

        const user = await User.findById(req.user.id).select('+password')

        // Check current password
        if (!(await user.matchPassword(fieldeToUpdate.currentPassword))) {
            return next({ message: `Password is incorrect`, statusCode: 401 })
        }

        user.password = fieldeToUpdate.newPassword
        await user.save()

        sendTokenResponse(user, 200, res)

    } catch (err) {
        next(err)
    }

}


//Get token from model And response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken()
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createAt: user.createAt
    }
    res.status(statusCode).json({ success: true, data: data, token })

}


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {

    //Get user by Email
    const user = await User.findOne({ email: req.body.email })

    // Check user exists
    if (!user) {
        return next({ message: `Tere is no user with that email`, statusCode: 404 })
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message = `You are receiving this email becuse you (or someone else) has
         requested the reset of a password. please make a PUT request to: \n\n ${resetUrl}`

    try {

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: message
        })

        res.status(200).json({ success: true, data: 'Email sent' })

    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next({ message: `Email could not be send`, statusCode: 500 })
    }

}


//@desc     Reset Password
//@route    PUT /api/vi/auth/resetpassword/:resettoken
//@access   Public
exports.ResetPassword = async (req, res, next) => {
    try {

        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return next({ message: `Invalid Token`, statusCode: 400 })
        }

        // Set new password
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        sendTokenResponse(user, 200, res)

    } catch (err) {
        next(err)
    }

}