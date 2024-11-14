const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// 登录接口
router.post('/login', UserController.login);

module.exports = router;