const db = require('../config/mysql'); 

const Product = {

    // get all products
    getAllProducts: async () => {
        const query = 'SELECT ProductID, ProductName, ProductType, ProductSpecifications, ProductImage, ProductPrice, ProductStock FROM product';
        const [rows] = await db.query(query);
        return rows;
    },

    // get product by ID
    getProductById: async (productId) => {
        const query = 'SELECT * FROM product WHERE ProductID = ?';
        const [rows] = await db.query(query, [productId]);
        return rows[0]; // return the first matched product
    },

    // update product
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
        return result; // return the update result
    },

    // delete product
    deleteProduct: async (productId) => {
        const query = 'DELETE FROM product WHERE ProductID = ?';
        const [result] = await db.query(query, [productId]);
        return result; // return the delete result
    },

    // add product
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
        return result; // return the insert result
    }
};

module.exports = Product;
