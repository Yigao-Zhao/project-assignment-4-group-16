const UserService = require('../services/userService');

const UserController = {
    // login user
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const { token, user } = await UserService.login(email, password);
			if(user.MiddleName != null){
				midname = user.MiddleName
			}else{
				midname = "";
			}
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.UserID,
                    email: user.Email,
                    isAdmin: user.IsAdmin,
					userName:user.FirstName+" "+midname+" "+user.LastName
                },
            });

        } catch (err) {
            console.error("Login error: ", err.message);
            // return error message
            res.status(401).json({
                success: false, message: 'Invalid email or password',
            });
        }
    },
    
    // get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.json({ 
                users 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // get user by id
    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await UserService.getUserById(userId);
    
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: `User with ID ${userId} not found` 
                });
            }
    
            res.json({ 
                user 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    },

    // create user
    createUser: async (req, res) => {
        const userData = req.body;
        try {
            const result = await UserService.createUser(userData);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                userId: result.insertId,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // update user
    updateUser: async (req, res) => {
        const userId = req.params.userId;
        const userData = req.body;
        try {
            const result = await UserService.updateUserById(userId, userData);
            res.json({success: true, message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({success: false,  message: error.message });
        }
    },

    // delete user
    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            await UserService.deleteUserById(userId);
            res.json({ success: true,message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({success: false,  message: error.message });
        }
    },

    // check if email exists
    checkEmailExists: async (req, res) => {
        const { email } = req.query;
        try {
            const exists = await UserService.checkEmailExists(email);
            res.json({ 
                success: true, 
                message: exists ? 'Email exists' : 'Email does not exist', 
                exists 
            });
        } catch (error) {
            res.status(500).json({success: false,  message: error.message });
        }
    },
};

module.exports = UserController;
