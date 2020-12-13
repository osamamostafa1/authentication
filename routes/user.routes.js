const express = require('express')
const { protect, authorize } = require('../middleware/authorization')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.get('/', [protect, authorize('admin')], userController.getUsers)
router.get('/:id', [protect, authorize('admin')], userController.getUser)
router.post('/', [protect, authorize('admin')], userController.createUser)
router.put('/:id', [protect, authorize('admin')], userController.updateUser)
router.delete('/:id', [protect, authorize('admin')], userController.deleteUser)


module.exports = router