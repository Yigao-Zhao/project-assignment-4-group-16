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

// delete User
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // 查询是否存在此用户
        const [rows] = await pool.query('SELECT * FROM user WHERE UserID = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 删除用户
        await pool.query('DELETE FROM user WHERE UserID = ?', [userId]);

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});

// 添加新用户
router.post('/users', async (req, res) => {
    const { FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin } = req.body;

    // 验证必填字段
    if (!FirstName || !LastName || !Address || !Email || !PaymentMethod || !IsAdmin) {
        return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    // 验证 Email 格式
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(Email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // 验证 IsAdmin 字段是否为 'Y' 或 'N'
    if (IsAdmin !== 'Y' && IsAdmin !== 'N') {
        return res.status(400).json({ success: false, message: 'IsAdmin must be "Y" or "N".' });
    }

    // 插入用户到数据库
    try {

        // 检查是否已有相同的邮箱
        const [existingUser] = await pool.query('SELECT * FROM user WHERE Email = ?', [Email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        const [result] = await pool.query(
            `INSERT INTO user (FirstName, MiddleName, LastName, Address, Email, PaymentMethod, IsAdmin)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                FirstName.trim(),
                MiddleName ? MiddleName.trim() : null,
                LastName.trim(),
                Address.trim(),
                Email.trim(),
                PaymentMethod.trim(),
                IsAdmin
            ]
        );

        res.status(201).json({
            success: true,
            message: 'User added successfully.',
            userId: result.insertId // 返回新用户的 ID
        });
    } catch (error) {
        console.error('Error adding user:', error);
        // 判断是否为数据库唯一约束错误
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        res.status(500).json({ success: false, message: 'Failed to add user.' });
    }
});


// 检查邮箱是否存在
router.get('/check-email', async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
  
    try {
      const [result] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
      if (result.length > 0) {
        return res.json({ exists: true });  // 邮箱已存在
      }
      return res.json({ exists: false });  // 邮箱不存在
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ success: false, message: 'Failed to check email.' });
    }
  });

module.exports = router;