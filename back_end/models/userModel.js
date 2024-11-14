const db = require('../config/mysql'); 

const User = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0]; 
    },

};

module.exports = User;