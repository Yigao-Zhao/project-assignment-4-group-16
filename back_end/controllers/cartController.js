const CartService = require('../services/cartService');

const CartController = {
    // 获取用户的购物车
    getCartByUserId: async (req, res) => {
        try {
            const { userId } = req.params; // 从请求参数中获取用户ID
            const result = await CartService.getCartByUserId(userId);
            res.status(200).json(result); // 成功返回购物车信息
        } catch (err) {
            console.error('Error in CartController.getCartByUserId:', err.message);
            res.status(500).json({ success: false, message: 'Failed to retrieve cart', error: err.message });
        }
    },

    // 添加商品到购物车
    addItemToCart: async (req, res) => {
        try {
            const { userId, cartId, productId, quantity } = req.body; // 从请求体中获取参数
            const result = await CartService.addItemToCart(userId, cartId, productId, quantity);
            res.status(201).json(result); // 成功返回添加结果
        } catch (err) {
            console.error('Error in CartController.addItemToCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
        }
    },

	// 添加商品到购物车
	addItemToCartde: async (req, res) => {
	    try {
	        const { userId, cartId, productId, quantity } = req.body; // 从请求体中获取参数
	        const result = await CartService.addItemToCartde(userId, cartId, productId, quantity);
	        res.status(201).json(result); // 成功返回添加结果
	    } catch (err) {
	        console.error('Error in CartController.addItemToCart:', err.message);
	        res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
	    }
	},

    // 删除购物车中的商品
    removeItemFromCart: async (req, res) => {
        try {
            const { userId, cartId, productId } = req.body; // 从请求体中获取参数
            const result = await CartService.removeItemFromCart(userId, cartId, productId);
            res.status(200).json(result); // 成功返回删除结果
        } catch (err) {
            console.error('Error in CartController.removeItemFromCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: err.message });
        }
    },

    // 更新购物车中商品数量
    updateCartItemQuantity: async (req, res) => {
        try {
            const { userId, cartId, productId, quantity } = req.body; // 从请求体中获取参数
            const result = await CartService.updateCartItemQuantity(userId, cartId, productId, quantity);
            res.status(200).json(result); // 成功返回更新结果
        } catch (err) {
            console.error('Error in CartController.updateCartItemQuantity:', err.message);
            res.status(500).json({ success: false, message: 'Failed to update cart item quantity', error: err.message });
        }
    }
};

module.exports = CartController;