
const Product = require('../models/productModel');


const ProductService = {

	getAllProducts: async () => {
	        try {
	            const products = await Product.getAllProducts(); 
	            return products; 
	        } catch (err) {
	            console.error('Error in ProductService.getAllProducts:', err.message);
	            throw new Error('Failed to retrieve users'); 
	        }
	    },
};

module.exports = ProductService;