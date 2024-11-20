const express = require('express');
const ProductController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const pool = require('../config/mysql'); // 引入数据库连接池
const router = express.Router();

router.get('/products', verifyToken, isAdmin, ProductController.getAllProducts);

router.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const {
        ProductName,
        ProductType,
        ProductSpecifications,
        ProductImage,
        ProductPrice,
        ProductStock,
    } = req.body;

    try {
        // 更新产品信息
        const [result] = await pool.query(
            `UPDATE product
             SET 
                 ProductName = ?, 
                 ProductType = ?, 
                 ProductSpecifications = ?, 
                 ProductImage = ?, 
                 ProductPrice = ?, 
                 ProductStock = ? 
             WHERE ProductID = ?`,
            [ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

module.exports = router;