const express = require('express');
const CartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware'); 
const router = express.Router();

// 获取用户的购物车
router.get('/cart/:userId', verifyToken, CartController.getCartByUserId);

// 添加商品到购物车
router.post('/cart', verifyToken, CartController.addItemToCart);


// 减少一个
router.post('/cart/delete', verifyToken, CartController.addItemToCartde);

// 更新购物车中商品数量
router.put('/cart', verifyToken, CartController.updateCartItemQuantity);

// 删除购物车中的商品
router.delete('/cart', verifyToken, CartController.removeItemFromCart);

module.exports = router;