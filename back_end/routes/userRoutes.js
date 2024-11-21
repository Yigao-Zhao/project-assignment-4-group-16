const express = require('express');
const UserController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const pool = require('../config/mysql'); // 引入数据库连接池
const router = express.Router();

router.post('/login', UserController.login);
router.get('/users', verifyToken, isAdmin, UserController.getAllUsers);

router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const {
        FirstName,
        MiddleName,
        LastName,
        Address,
        Email,
        PaymentMethod,
        IsAdmin,
    } = req.body;

    try {
        // 更新产品信息
        const [result] = await pool.query(
            `UPDATE user
             SET 
                 FirstName = ?, 
                 MiddleName = ?, 
                 LastName = ?, 
                 Address = ?, 
                 Email = ?, 
                 PaymentMethod = ?, 
                 IsAdmin = ?
             WHERE UserID = ?`,
            [FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
});


module.exports = router;