const db = require('../config/mysql');

const User = {

    // get user by email
    findByEmail: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];  // return the first matched user
    },

    // get all users
    getAllUsers: async () => {
        const query = 'SELECT * FROM user';
        const [rows] = await db.query(query);
        return rows;
    },

    // update user by ID
    updateUserById: async (userId, userData) => {
        const {
            FirstName,
            MiddleName,
            LastName,
            Address,
            Email,
            PaymentMethod,
            IsAdmin,
            MyPassword
        } = userData;

        const query = `
            UPDATE user
            SET 
                FirstName = ?, 
                MiddleName = ?, 
                LastName = ?, 
                Address = ?, 
                Email = ?, 
                PaymentMethod = ?, 
                IsAdmin = ?, 
                MyPassword = ?
            WHERE UserID = ?
        `;
        const [result] = await db.query(query, [
            FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin, MyPassword, userId
        ]);
        return result;
    },

    // get user by ID
	getUserById: async (userId) => {
	   console.log(userId)
	    const query = `
	        SELECT *
	        FROM user
	        WHERE UserID = ?
	    `;
	    const [result] = await db.query(query, [
	        userId
	    ]);
	    return result;
	},

    // delete user by ID
    deleteUserById: async (userId) => {
        const query = 'DELETE FROM user WHERE UserID = ?';
    
        try {
            const [result] = await db.query(query, [userId]);
    
            // if user not found or already deleted
            if (result.affectedRows === 0) {
                return { success: false, message: 'User not found or already deleted' };
            }
    
            // if user is successfully deleted
            return { success: true, message: 'User deleted successfully' };
    
        } catch (err) {
            console.error('Error in UserService.deleteUserById:', err.message);
            // if error occurs
            return { success: false, message: 'Failed to delete user' };
        }
    },

    // create user
    createUser: async (userData) => {
        const { FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin, MyPassword } = userData;

        const query = `
            INSERT INTO user (FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin, MyPassword)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            FirstName.trim(),
            MiddleName ? MiddleName.trim() : null,
            LastName.trim(),
            Address.trim(),
            Email.trim(),
            PaymentMethod.trim(),
            IsAdmin,
            MyPassword.trim()
        ]);
        return result;
    },

    // check if email exists
    checkEmailExists: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows.length > 0;  // return true if email exists
    }
};

module.exports = User;
