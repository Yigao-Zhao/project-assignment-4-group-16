const db = require('../config/mysql');

const User = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];  // 返回匹配的第一个用户
    },

    getAllUsers: async () => {
        const query = 'SELECT * FROM user';
        const [rows] = await db.query(query);
        return rows;
    },

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

    deleteUserById: async (userId) => {
        const query = 'DELETE FROM user WHERE UserID = ?';
    
        try {
            // 执行删除查询
            const [result] = await db.query(query, [userId]);
    
            // 如果没有删除任何记录，则返回 "User not found" 错误
            if (result.affectedRows === 0) {
                return { success: false, message: 'User not found or already deleted' };
            }
    
            // 如果删除成功，返回成功信息
            return { success: true, message: 'User deleted successfully' };
    
        } catch (err) {
            console.error('Error in UserService.deleteUserById:', err.message);
            // 捕获异常并返回失败信息
            return { success: false, message: 'Failed to delete user' };
        }
    },

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

    checkEmailExists: async (email) => {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [rows] = await db.query(query, [email]);
        return rows.length > 0;  // 返回布尔值
    }
};

module.exports = User;
