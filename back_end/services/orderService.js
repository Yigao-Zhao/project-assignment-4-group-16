const Order = require('../models/orderModel');

const OrderService = {

    // add item to cart
    paymentOrder: async (userId, item, cardDetails) => {
        try {
            const result = await Order.addOrder(userId, item, cardDetails);
            return { success: true, message: 'Order added successfully', cartItemId: result.insertId };
        } catch (err) {
            console.error('Error in OrderService.paymentOrder:', err.message);
            throw new Error('Failed to add order');
        }
    },

    // get order by user id
	getOrderByUserId: async (userId) => {
	    try {
	        const OrderItems = await Order.getOrderByUserId(userId);
	        if (!OrderItems || OrderItems.length === 0) {
	        }
	        return { success: true, OrderItems };
	    } catch (err) {
	        console.error('Error in OrderService.getOrderByUserId:', err.message);
	        throw new Error('Failed to retrieve order');
	    }
	},
	
}
module.exports = OrderService;