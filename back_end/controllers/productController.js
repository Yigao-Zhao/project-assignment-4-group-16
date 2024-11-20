const ProductService = require('../services/productService');
const ProductController = {

	
	getAllProducts: async (req, res) => {
	        try {
	            const products = await ProductService.getAllProducts();
				console.log(products)
	            res.json(products);
	        } catch (err) {
	            res.status(500).json({message: err.message});
	        }
	    },
};

module.exports = ProductController;