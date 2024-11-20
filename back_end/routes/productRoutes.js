const express = require('express');
const ProductController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/products', ProductController.getAllProducts);


module.exports = router;