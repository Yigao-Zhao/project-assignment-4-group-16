const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt'); // include bcrypt to hash passwords
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h'; // set the expiration time for the token

const UserService = {
    // login user
    login: async (email, password) => {
        // find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (password !== user.MyPassword) {
            throw new Error('Invalid email or password');
        }
        // generate JWT token
        const token = jwt.sign(
            { id: user.UserID, email: user.Email, isAdmin: user.IsAdmin },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        return { token, user };
    },

    // get all users
    getAllUsers: async () => {
        try {
            const users = await User.getAllUsers();
            return users;
        } catch (err) {
            console.error('Error in UserService.getAllUsers:', err.message);
            throw new Error('Failed to retrieve users');
        }
    },

    // update user by ID
    updateUserById: async (userId, userData) => {
        try {
			console.log(123)
			console.log(userId)
			console.log(userData)
			console.log(456)
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

    //get user by ID
	getUserById: async (userId) => {
	    try {
	        const result = await User.getUserById(userId);
	        if (result.affectedRows === 0) {
	            throw new Error('User not found');
	        }
	        return result;
	    } catch (err) {
	        console.error('Error in UserService.updateUserById:', err.message);
	        throw new Error('Failed to update user');
	    }
	},

    // delete user by ID
    deleteUserById: async (userId) => {
        try {
            // check if userId is a string or number
            if (typeof userId !== 'string' && typeof userId !== 'number') {
                throw new Error('Invalid userId type');
            }
            console.log("Attempting to delete user with ID:", userId);
            const response = await User.deleteUserById(userId);
            console.log("Response from deleteUserById:", response);
            
            if (response.success) {
                console.log('User deleted successfully');
                return { success: true }; // if user is successfully deleted
            } else {
                // if user not found or already deleted
                throw new Error('Failed to delete user. Response was not successful.');
            }
        } catch (err) {
            console.error('Error in UserService.deleteUserById:', err.message);
            return { success: false, message: err.message };
        }
    },

    // create user
    createUser: async (userData) => {
        // check if email already exists
        const emailExists = await User.checkEmailExists(userData.Email);
        if (emailExists) {
            throw new Error('Email already exists');
        }

        // hash the password
        hashedPassword=userData.MyPassword;
        // add user to database
        try {
            const newUserData = {
                ...userData,
                MyPassword: hashedPassword, // store hashed password
            };
            const result = await User.createUser(newUserData);
            return result;
        } catch (err) {
            console.error('Error in UserService.createUser:', err.message);
            throw new Error('Failed to create user');
        }
    },

    // check if email exists
    checkEmailExists: async (email) => {
        return await User.checkEmailExists(email);
    }
};

module.exports = UserService;
