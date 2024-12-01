const ProductService = require('../services/productService');

const ProductController = {

    // get all products
    getAllProducts: async (req, res) => {
        try {
            const result = await ProductService.getAllProducts(); // call service layer to get all products
            if (result.success) {
                res.status(200).json(result); // return 200 status code and products data
            } else {
                res.status(404).json({ success: false, message: result.message }); // return 404 error if no products found
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ success: false, message: err.message }); // catch error and return 500 error code
        }
    },

    // get product by id
    getProductById: async (req, res) => {
        const productId = req.params.id;
        try {
            const result = await ProductService.getProductById(productId); // call service layer to get product by id
            if (result.success) {
                res.status(200).json(result); // return 200 status code and product data
            } else {
                res.status(404).json({ success: false, message: result.message }); // return 404 error if product not found
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            res.status(500).json({ success: false, message: err.message }); // catch error and return 500 error code
        }
    },

    // update product
    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const productData = req.body;
        try {
            const result = await ProductService.updateProduct(productId, productData); // call service layer to update product
            if (result.success) {
                res.status(200).json(result); // return 200 status code and success message
            } else {
                res.status(404).json({ success: false, message: result.message }); // return 404 error if product not found
            }
        } catch (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ success: false, message: err.message }); // catch error and return 500 error code
        }
    },

    // delete product
    deleteProduct: async (req, res) => {
        const productId = req.params.id;
        try {
            const result = await ProductService.deleteProduct(productId); // call service layer to delete product
            if (result.success) {
                res.status(200).json(result); // return 200 status code and success message
            } else {
                res.status(404).json({ success: false, message: result.message }); // return 404 error if product not found
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ success: false, message: err.message }); // catch error and return 500 error code
        }
    },

    // add product
    addProduct: async (req, res) => {
        const productData = req.body;
        try {
            const result = await ProductService.addProduct(productData); // call service layer to add product
            if (result.success) {
                res.status(201).json(result); // return 201 status code and success message
            } else {
                res.status(400).json({ success: false, message: result.message }); // return 400 error if product data is invalid
            }
        } catch (err) {
            console.error('Error adding product:', err);
            res.status(500).json({ success: false, message: err.message }); // catch error and return 500 error code
        }
    }

};

module.exports = ProductController;
