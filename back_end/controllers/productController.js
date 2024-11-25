const ProductService = require('../services/productService');

const ProductController = {

    // 获取所有产品
    getAllProducts: async (req, res) => {
        try {
            const result = await ProductService.getAllProducts(); // 调用 service 层获取产品
            if (result.success) {
                res.status(200).json(result); // 成功时返回 200 状态码，并将数据返回给客户端
            } else {
                res.status(404).json({ success: false, message: result.message }); // 如果没有找到产品，返回 404 错误
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ success: false, message: err.message }); // 捕获错误并返回 500 错误码
        }
    },

    // 获取单个产品
    getProductById: async (req, res) => {
        const productId = req.params.id;
        try {
            const result = await ProductService.getProductById(productId); // 调用 service 层获取单个产品
            if (result.success) {
                res.status(200).json(result); // 成功时返回 200 状态码，并返回产品数据
            } else {
                res.status(404).json({ success: false, message: result.message }); // 如果没有找到产品，返回 404 错误
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            res.status(500).json({ success: false, message: err.message }); // 捕获错误并返回 500 错误码
        }
    },

    // 更新产品
    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const productData = req.body;
        try {
            const result = await ProductService.updateProduct(productId, productData); // 调用 service 层更新产品
            if (result.success) {
                res.status(200).json(result); // 成功时返回 200 状态码，并返回更新成功的信息
            } else {
                res.status(404).json({ success: false, message: result.message }); // 如果没有找到产品，返回 404 错误
            }
        } catch (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ success: false, message: err.message }); // 捕获错误并返回 500 错误码
        }
    },

    // 删除产品
    deleteProduct: async (req, res) => {
        const productId = req.params.id;
        try {
            const result = await ProductService.deleteProduct(productId); // 调用 service 层删除产品
            if (result.success) {
                res.status(200).json(result); // 成功时返回 200 状态码，并返回删除成功的信息
            } else {
                res.status(404).json({ success: false, message: result.message }); // 如果没有找到产品，返回 404 错误
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ success: false, message: err.message }); // 捕获错误并返回 500 错误码
        }
    },

    // 添加产品
    addProduct: async (req, res) => {
        const productData = req.body;
        try {
            const result = await ProductService.addProduct(productData); // 调用 service 层添加产品
            if (result.success) {
                res.status(201).json(result); // 成功时返回 201 状态码，并返回新创建的产品数据
            } else {
                res.status(400).json({ success: false, message: result.message }); // 如果发生错误，返回 400 错误
            }
        } catch (err) {
            console.error('Error adding product:', err);
            res.status(500).json({ success: false, message: err.message }); // 捕获错误并返回 500 错误码
        }
    }

};

module.exports = ProductController;
