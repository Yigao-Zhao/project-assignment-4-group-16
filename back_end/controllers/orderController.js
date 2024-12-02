const OrderService = require('../services/orderService');

const OrderController = {
   
	getOrderByUserId: async (req, res) => {
	    try {
	        const { userId } = req.params; // get user id from request params
	        const result = await OrderService.getOrderByUserId(userId);
	        res.status(200).json(result); // return order information
	    } catch (err) {
	        console.error('Error in OrderController.getOrderByUserId:', err.message);
	        res.status(500).json({ success: false, message: 'Failed to retrieve Order', error: err.message });
	    }
	},
    addOrder: async (req, res) => {
		console.log("cont")
        try {
            const { userId, item, cardDetails } = req.body; // get parameters from request body
            const result = await OrderService.paymentOrder(userId, item, cardDetails);
            res.status(201).json(result); // return success message
        } catch (err) {
            console.error('Error in OrderController.addItemToOrder:', err.message);
            res.status(500).json({ success: false, message: 'Failed to add item to Order', error: err.message });
        }
    }

}
module.exports = OrderController;