const Cart = require('../models/cartModel');

const CartService = {

    // 获取用户的购物车
    getCartByUserId: async (userId) => {
        try {
            const cartItems = await Cart.getCartByUserId(userId);
            if (!cartItems || cartItems.length === 0) {
                throw new Error('No cart items found for this user');
            }
            return { success: true, cartItems };
        } catch (err) {
            console.error('Error in CartService.getCartByUserId:', err.message);
            throw new Error('Failed to retrieve cart items');
        }
    },

    // 增加商品到购物车
    addItemToCart: async (userId, cartId, productId, quantity) => {
        try {
            const result = await Cart.addItem(userId, cartId, productId, quantity);
            return { success: true, message: 'Item added to cart successfully', cartItemId: result.insertId };
        } catch (err) {
            console.error('Error in CartService.addItemToCart:', err.message);
            throw new Error('Failed to add item to cart');
        }
    },
	// 增加商品到购物车
	addItemToCart: async (userId, cartId, productId, quantity) => {
	    try {
	        const result = await Cart.addItem(userId, cartId, productId, quantity);
	        return { success: true, message: 'Item added to cart successfully', cartItemId: result.insertId };
	    } catch (err) {
	        console.error('Error in CartService.addItemToCart:', err.message);
	        throw new Error('Failed to add item to cart');
	    }
	},

    // 删除购物车中的商品
    removeItemFromCart: async (userId, cartId, productId) => {
        try {
            const result = await Cart.removeItem(userId, cartId, productId);
            if (!result.success) {
                throw new Error(result.message);
            }
            return { success: true, message: 'Item removed from cart successfully' };
        } catch (err) {
            console.error('Error in CartService.removeItemFromCart:', err.message);
            throw new Error('Failed to remove item from cart');
        }
    },

    // 更新购物车中商品数量
    updateCartItemQuantity: async (userId, cartId, productId, quantity) => {
        try {
            const result = await Cart.updateQuantity(userId, cartId, productId, quantity);
            if (!result.success) {
                throw new Error(result.message);
            }
            return { success: true, message: 'Cart item quantity updated successfully' };
        } catch (err) {
            console.error('Error in CartService.updateCartItemQuantity:', err.message);
            throw new Error('Failed to update cart item quantity');
        }
    }
};

module.exports = CartService;