const express = require('express');
const ProductController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// get all products
router.get('/products', ProductController.getAllProducts);

// update product by id
router.put('/products/:id', ProductController.updateProduct);

// delete product by id
router.delete('/products/:id', ProductController.deleteProduct);

// add product
router.post('/products', ProductController.addProduct);

module.exports = router;
