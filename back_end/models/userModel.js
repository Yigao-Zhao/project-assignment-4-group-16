const db = require('../config/mysql'); 

const User = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0]; 
    },
	getAllUsers: async () => {
	        const query = 'SELECT UserID, FirstName, MiddleName, LastName, Address, Email, PaymentMethod, MyPassword, IsAdmin FROM user';
	        const [rows] = await db.query(query);
	        return rows; 
	    },

};

module.exports = User;