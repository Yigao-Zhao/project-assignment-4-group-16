const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const UserService = {
    login: async (email, password) => {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (password !== user.MyPassword) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.UserID, email: user.Email, isAdmin: user.IsAdmin },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return { token, user };
    },
};

module.exports = UserService;