const express = require('express');

const UserController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', UserController.login);
router.get('/users', verifyToken, isAdmin, UserController.getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, UserController.getUserById);

router.put('/users/:id',  UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);
router.post('/users', UserController.createUser);

router.get('/check-email', UserController.checkEmailExists);

module.exports = router;
