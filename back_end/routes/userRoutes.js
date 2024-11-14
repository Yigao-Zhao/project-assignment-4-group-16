const express = require('express');
const UserController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', UserController.login);
router.get('/users', verifyToken, isAdmin, UserController.getAllUsers);


module.exports = router;