const OrderService = require('../services/orderService');

const OrderController = {
   
	getOrderByUserId: async (req, res) => {
	    try {
	        const { userId } = req.params; // get user id from request params
	        const result = await OrderService.getOrderByUserId(userId);
	        res.status(200).json(result); // return order information
	    } catch (err) {
	        console.error('Error in CartController.getCartByUserId:', err.message);
	        res.status(500).json({ success: false, message: 'Failed to retrieve cart', error: err.message });
	    }
	},
    addOrder: async (req, res) => {
		console.log("cont")
        try {
            const { userId, item, cardDetails } = req.body; // get parameters from request body
            const result = await OrderService.paymentOrder(userId, item, cardDetails);
            res.status(201).json(result); // return success message
        } catch (err) {
            console.error('Error in CartController.addItemToCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
        }
    }

}
module.exports = OrderController;