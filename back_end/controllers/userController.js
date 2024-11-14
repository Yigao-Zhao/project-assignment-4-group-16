const UserService = require('../services/userService');
const AuthController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const { token, user } = await UserService.login(email, password);
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.UserID,
                    email: user.Email,
                    isAdmin: user.IsAdmin,
                },
            });
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    },
	
	getAllUsers: async (req, res) => {
	        try {
	            const users = await UserService.getAllUsers();
				console.log(users)
	            res.json(users);
	        } catch (err) {
	            res.status(500).json({message: err.message});
	        }
	    },
};

module.exports = AuthController;