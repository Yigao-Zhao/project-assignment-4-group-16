const db = require('../config/mysql'); 

const Product = {

    // 获取所有产品
    getAllProducts: async () => {
        const query = 'SELECT ProductID, ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock FROM product';
        const [rows] = await db.query(query);
        return rows;
    },

    // 根据 ID 获取单个产品
    getProductById: async (productId) => {
        const query = 'SELECT * FROM product WHERE ProductID = ?';
        const [rows] = await db.query(query, [productId]);
        return rows[0]; // 如果没有找到，返回 undefined
    },

    // 更新产品信息
    updateProduct: async (productId, productData) => {
        const query = `
            UPDATE product 
            SET 
                ProductName = ?, 
                ProductType = ?, 
                ProductSpecifications = ?, 
                ProductImage = ?, 
                ProductPrice = ?, 
                ProductStock = ? 
            WHERE ProductID = ?
        `;
        const [result] = await db.query(query, [
            productData.ProductName,
            productData.ProductType,
            productData.ProductSpecifications,
            productData.ProductImage,
            productData.ProductPrice,
            productData.ProductStock,
            productId
        ]);
        return result; // 返回执行的结果
    },

    // 删除产品
    deleteProduct: async (productId) => {
        const query = 'DELETE FROM product WHERE ProductID = ?';
        const [result] = await db.query(query, [productId]);
        return result; // 返回删除结果
    },

    // 添加新产品
    addProduct: async (productData) => {
        const query = `
            INSERT INTO product (ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            productData.ProductName,
            productData.ProductType,
            productData.ProductSpecifications || null,
            productData.ProductImage || null,
            productData.ProductPrice,
            productData.ProductStock
        ]);
        return result; // 返回插入的结果
    }
};

module.exports = Product;
