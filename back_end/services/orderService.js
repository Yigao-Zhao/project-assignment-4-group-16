const Order = require('../models/orderModel');

const OrderService = {

    // 获取用户的购物车
    // getCartByUserId: async (userId) => {
    //     try {
    //         const cartItems = await Cart.getCartByUserId(userId);
    //         if (!cartItems || cartItems.length === 0) {
    //             throw new Error('No cart items found for this user');
    //         }
    //         return { success: true, cartItems };
    //     } catch (err) {
    //         console.error('Error in CartService.getCartByUserId:', err.message);
    //         throw new Error('Failed to retrieve cart items');
    //     }
    // },

    // 增加商品到购物车
    paymentOrder: async (userId, item, cardDetails) => {
        try {
            const result = await Order.addOrder(userId, item, cardDetails);
            return { success: true, message: 'Item added to cart successfully', cartItemId: result.insertId };
        } catch (err) {
            console.error('Error in CartService.addItemToCart:', err.message);
            throw new Error('Failed to add item to cart');
        }
    },
	getOrderByUserId: async (userId) => {
	    try {
	        const OrderItems = await Order.getOrderByUserId(userId);
	        if (!OrderItems || OrderItems.length === 0) {
	        }
	        return { success: true, OrderItems };
	    } catch (err) {
	        console.error('Error in CartService.getCartByUserId:', err.message);
	        throw new Error('Failed to retrieve cart items');
	    }
	},
	
}
module.exports = OrderService;