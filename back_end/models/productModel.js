const db = require('../config/mysql'); 

const Product = {
  
	getAllProducts: async () => {
	        const query = 'SELECT ProductID, ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductPrice,ProductStock FROM product';
	        const [rows] = await db.query(query);
	        return rows; 
	    },

};

module.exports = Product;