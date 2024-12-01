const CartService = require('../services/cartService');

const CartController = {
    // get cart by user id
    getCartByUserId: async (req, res) => {
        try {
            const { userId } = req.params; // get user id from request params
            const result = await CartService.getCartByUserId(userId);
            res.status(200).json(result); // return cart information
        } catch (err) {
            console.error('Error in CartController.getCartByUserId:', err.message);
            res.status(500).json({ success: false, message: 'Failed to retrieve cart', error: err.message });
        }
    },

    // add item to cart
    addItemToCart: async (req, res) => {
        try {
            const { userId, cartId, productId, quantity } = req.body; // get parameters from request body
            const result = await CartService.addItemToCart(userId, cartId, productId, quantity);
            res.status(201).json(result); 
        } catch (err) {
            console.error('Error in CartController.addItemToCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
        }
    },

	// add item to cartde
	addItemToCartde: async (req, res) => {
	    try {
	        const { userId, cartId, productId, quantity } = req.body; 
	        const result = await CartService.addItemToCartde(userId, cartId, productId, quantity);
	        res.status(201).json(result); 
	    } catch (err) {
	        console.error('Error in CartController.addItemToCart:', err.message);
	        res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
	    }
	},

    // remove item from cart
    removeItemFromCart: async (req, res) => {
        try {
            const { userId, cartId, productId } = req.body; 
            const result = await CartService.removeItemFromCart(userId, cartId, productId);
            res.status(200).json(result); 
        } catch (err) {
            console.error('Error in CartController.removeItemFromCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: err.message });
        }
    },

    // update cart item quantity
    updateCartItemQuantity: async (req, res) => {
        try {
            const { userId, cartId, productId, quantity } = req.body; 
            const result = await CartService.updateCartItemQuantity(userId, cartId, productId, quantity);
            res.status(200).json(result); 
        } catch (err) {
            console.error('Error in CartController.updateCartItemQuantity:', err.message);
            res.status(500).json({ success: false, message: 'Failed to update cart item quantity', error: err.message });
        }
    }
};

module.exports = CartController;