const express = require('express')
const { protect } = require('../middleware/authorization')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', [protect], authController.getMe)
router.put('/updatedetails', [protect], authController.UpdateDetails)
router.put('/updatepassword', [protect], authController.UpdatePassword)
router.post('/forgotpassword', authController.forgotPassword)
router.put('/resetpassword/:resettoken', authController.ResetPassword)

module.exports = router