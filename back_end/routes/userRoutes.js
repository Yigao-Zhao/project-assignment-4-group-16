const express = require('express');

const UserController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//login user
router.post('/login', UserController.login);

//get all users
router.get('/users', verifyToken, isAdmin, UserController.getAllUsers);

//get user by id
router.get('/users/:userId', UserController.getUserById);

//update user by id
router.put('/users/:userId',  UserController.updateUser);

//delete user by id
router.delete('/users/:id', UserController.deleteUser);

//create user
router.post('/users', UserController.createUser);

// check if email exists
router.get('/check-email', UserController.checkEmailExists);

module.exports = router;
