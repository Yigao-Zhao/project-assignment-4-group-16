const Product = require('../models/productModel');

const ProductService = {

    // 获取所有产品
    getAllProducts: async () => {
        try {
            const products = await Product.getAllProducts();
            if (!products || products.length === 0) {
                throw new Error('No products found');
            }
            return { success: true, products };
        } catch (err) {
            console.error('Error in ProductService.getAllProducts:', err.message);
            throw new Error('Failed to retrieve products');
        }
    },

    // 获取单个产品
    getProductById: async (productId) => {
        try {
            const product = await Product.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return { success: true, product };
        } catch (err) {
            console.error('Error in ProductService.getProductById:', err.message);
            throw new Error('Failed to retrieve product');
        }
    },

    // 更新产品
    updateProduct: async (productId, productData) => {
        try {
            const result = await Product.updateProduct(productId, productData);
            if (result.affectedRows === 0) {
                throw new Error('Product not found');
            }
            return { success: true, message: 'Product updated successfully' };
        } catch (err) {
            console.error('Error in ProductService.updateProduct:', err.message);
            throw new Error('Failed to update product');
        }
    },

    // 删除产品
    deleteProduct: async (productId) => {
        try {
            const result = await Product.deleteProduct(productId);
            if (result.affectedRows === 0) {
                throw new Error('Product not found');
            }
            return { success: true, message: 'Product deleted successfully' };
        } catch (err) {
            console.error('Error in ProductService.deleteProduct:', err.message);
            throw new Error('Failed to delete product');
        }
    },

    // 添加产品
    addProduct: async (productData) => {
        try {
            const result = await Product.addProduct(productData);
            return { success: true, message: 'Product added successfully', productId: result.insertId };
        } catch (err) {
            console.error('Error in ProductService.addProduct:', err.message);
            throw new Error('Failed to add product');
        }
    }

};

module.exports = ProductService;
