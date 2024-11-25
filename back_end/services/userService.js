const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt'); // 用于密码加密和验证
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h'; // 设置JWT默认有效期

const UserService = {
    login: async (email, password) => {
        // 查找用户
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (password !== user.MyPassword) {
            throw new Error('Invalid email or password');
        }
        // 生成JWT token
        const token = jwt.sign(
            { id: user.UserID, email: user.Email, isAdmin: user.IsAdmin },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        return { token, user };
    },

    // 获取所有用户
    getAllUsers: async () => {
        try {
            const users = await User.getAllUsers();
            return users;
        } catch (err) {
            console.error('Error in UserService.getAllUsers:', err.message);
            throw new Error('Failed to retrieve users');
        }
    },

    // 更新用户
    updateUserById: async (userId, userData) => {
        try {
            const result = await User.updateUserById(userId, userData);
            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }
            return result;
        } catch (err) {
            console.error('Error in UserService.updateUserById:', err.message);
            throw new Error('Failed to update user');
        }
    },

    // 删除用户
    deleteUserById: async (userId) => {
        try {
            // 确保 userId 是有效的（例如，数字或字符串）
            if (typeof userId !== 'string' && typeof userId !== 'number') {
                throw new Error('Invalid userId type');
            }
            console.log("Attempting to delete user with ID:", userId);
            const response = await User.deleteUserById(userId);
            console.log("Response from deleteUserById:", response);
            // 如果后端删除成功，返回一个成功消息
            if (response.success) {
                console.log('User deleted successfully');
                return { success: true }; // 返回删除成功的标志
            } else {
                // 如果后端返回失败，抛出一个错误
                throw new Error('Failed to delete user. Response was not successful.');
            }
        } catch (err) {
            console.error('Error in UserService.deleteUserById:', err.message);
            return { success: false, message: err.message };
        }
    },

    // 创建用户
    createUser: async (userData) => {
        // 先检查邮箱是否已存在
        const emailExists = await User.checkEmailExists(userData.Email);
        if (emailExists) {
            throw new Error('Email already exists');
        }

        // 加密密码
        //const hashedPassword = await bcrypt.hash(userData.MyPassword, 10);
        hashedPassword=userData.MyPassword;
        // 将用户数据插入数据库
        try {
            const newUserData = {
                ...userData,
                MyPassword: hashedPassword, // 使用加密后的密码
            };
            const result = await User.createUser(newUserData);
            return result;
        } catch (err) {
            console.error('Error in UserService.createUser:', err.message);
            throw new Error('Failed to create user');
        }
    },

    // 检查邮箱是否存在
    checkEmailExists: async (email) => {
        return await User.checkEmailExists(email);
    }
};

module.exports = UserService;
