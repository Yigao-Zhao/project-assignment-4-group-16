const OrderService = require('../services/orderService');

const OrderController = {
   
	getOrderByUserId: async (req, res) => {
	    try {
	        const { userId } = req.params; // 从请求参数中获取用户ID
	        const result = await OrderService.getOrderByUserId(userId);
	        res.status(200).json(result); // 成功返回购物车信息
	    } catch (err) {
	        console.error('Error in CartController.getCartByUserId:', err.message);
	        res.status(500).json({ success: false, message: 'Failed to retrieve cart', error: err.message });
	    }
	},
    addOrder: async (req, res) => {
		console.log("cont")
        try {
            const { userId, item, cardDetails } = req.body; // 从请求体中获取参数
            const result = await OrderService.paymentOrder(userId, item, cardDetails);
            res.status(201).json(result); // 成功返回添加结果
        } catch (err) {
            console.error('Error in CartController.addItemToCart:', err.message);
            res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
        }
    }

}
module.exports = OrderController;