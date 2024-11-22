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

// 删除产品
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // 查询是否存在此产品
        const [rows] = await pool.query('SELECT * FROM product WHERE ProductID = ?', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // 删除产品
        await pool.query('DELETE FROM product WHERE ProductID = ?', [productId]);

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

router.post('/products', async (req, res) => {
    const { ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock } = req.body;

    // 验证必填字段
    if (!ProductName || !ProductType || !ProductPrice || !ProductStock) {
        return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    // 确保 ProductPrice 和 ProductStock 是有效数字
    const price = parseFloat(ProductPrice);
    const stock = parseInt(ProductStock, 10);

    if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ success: false, message: 'ProductPrice and ProductStock must be valid numbers.' });
    }

    // 插入产品到数据库
    try {
        const [result] = await pool.query(
            `INSERT INTO product (ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                ProductName.trim(),
                ProductType.trim(),
                ProductSpecifications ? ProductSpecifications.trim() : null,
                ProductImage ? ProductImage.trim() : null,
                price,
                stock
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Product added successfully.',
            productId: result.insertId // 返回新产品的 ID
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});




module.exports = router;