const express = require('express');
const OrderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware'); 
const router = express.Router();

// // 获取用户的购物车
// router.get('/order/:userId', verifyToken, CartController.getCartByUserId);

// 生成订单
router.post('/order/payment', verifyToken, OrderController.addOrder);


module.exports = router;