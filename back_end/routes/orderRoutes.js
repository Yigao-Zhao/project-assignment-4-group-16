const express = require('express');
const OrderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware'); 
const router = express.Router();

// Add order
router.post('/order/payment', verifyToken, OrderController.addOrder);

// Get order by user id
router.get('/order/:userId', verifyToken, OrderController.getOrderByUserId);


module.exports = router;