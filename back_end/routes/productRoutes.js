const express = require('express');
const ProductController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// 获取所有产品
router.get('/products', ProductController.getAllProducts);

// 更新产品信息
router.put('/products/:id', ProductController.updateProduct);

// 删除产品
router.delete('/products/:id', ProductController.deleteProduct);

// 添加新产品
router.post('/products', ProductController.addProduct);

module.exports = router;
