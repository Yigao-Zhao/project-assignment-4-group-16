const express = require('express');
const CartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware'); 
const router = express.Router();

// get cart by user id
router.get('/cart/:userId', verifyToken, CartController.getCartByUserId);

// add item to cart
router.post('/cart', verifyToken, CartController.addItemToCart);


// delete item from cart
router.post('/cart/delete', verifyToken, CartController.addItemToCartde);

// update cart item quantity
router.put('/cart', verifyToken, CartController.updateCartItemQuantity);

// remove item from cart
router.delete('/cart', verifyToken, CartController.removeItemFromCart);

module.exports = router;