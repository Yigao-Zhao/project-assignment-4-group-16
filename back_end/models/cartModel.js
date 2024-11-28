const db = require('../config/mysql');

const Cart = {
    // 增加商品到购物车
    addItem: async (userId, quantity, productId) => {
        // 提取 userId
        // 从 userId 对象中获取 id
    
        // 查询 Cart 表是否存在 UserID 对应的 CartID
        let query = `SELECT CartID FROM Cart WHERE UserID = ?`;
        const [cartRows] = await db.query(query, [userId]);
    
        let cartId;
    
        if (cartRows.length > 0) {
            // 如果找到记录，获取 CartID
            cartId = cartRows[0].CartID;
        } else {
            // 如果没有记录，插入新的 Cart 并获取 CartID
            query = `INSERT INTO Cart (UserID) VALUES (?)`;
            console.log('SQL Query (Insert Cart):', query, [userId]);
            const [result] = await db.query(query, [userId]);
            cartId = result.insertId; // 获取新创建的 Cart 的 ID
        }
    
        // 检查 Cart_Item 表中是否已有对应的 CartID 和 ProductID
        query = `SELECT Quantity FROM Cart_Item WHERE CartID = ? AND CartProductID = ?`;
        const [itemRows] = await db.query(query, [cartId, productId]);
    
        if (itemRows.length > 0) {
            // 如果记录已存在，更新 Quantity
            query = `
                UPDATE Cart_Item
                SET Quantity = Quantity + 1
                WHERE CartID = ? AND CartProductID = ?
            `;
            console.log('SQL Query (Update Cart_Item):', query, [cartId, productId]);
            await db.query(query, [ cartId, productId]);
        } else {
            // 如果记录不存在，插入新记录
            query = `
                INSERT INTO Cart_Item (CartID, CartProductID, Quantity)
                VALUES (?, ?, 1)
            `;
            console.log('SQL Query (Insert Cart_Item):', query, [cartId, productId, quantity]);
            await db.query(query, [cartId, productId, quantity]);
        }
    
        return { cartId, productId, quantity };
    },

    // 删除购物车中的商品
    removeItem: async (userId,a, productId) => {
        // 查询 CartID
		console.log(a)
		console.log(productId)
		console.log(userId)
        let query = `
            SELECT CartID 
            FROM Cart
            WHERE UserID = ?
        `;
        const [cartRows] = await db.query(query, [userId]);
    
        if (cartRows.length === 0) {
            return { success: false, message: 'Cart not found for the user' };
        }
    
        const cartId = cartRows[0].CartID;
		
        // 查询当前 Quantity
        query = `
            SELECT Quantity 
            FROM Cart_Item
            WHERE CartID = ? AND CartProductID = ?
        `;
        const [itemRows] = await db.query(query, [cartId, productId]);
    
        if (itemRows.length === 0) {
            return { success: false, message: 'Item not found in the cart' };
        }
    
        const currentQuantity = itemRows[0].Quantity;
    
        if (currentQuantity > 1) {
            // 如果数量大于 1，则减少数量
            query = `
                UPDATE Cart_Item
                SET Quantity = Quantity - 1
                WHERE CartID = ? AND CartProductID = ?
            `;
            const [updateResult] = await db.query(query, [cartId, productId]);
            return {
                success: true,
                message: 'Quantity decreased by 1',
                affectedRows: updateResult.affectedRows,
            };
        } else {
            // 如果数量等于 1，则删除记录
            query = `
                DELETE FROM Cart_Item
                WHERE CartID = ? AND CartProductID = ?
            `;
            const [deleteResult] = await db.query(query, [cartId, productId]);
            return {
                success: true,
                message: 'Item deleted successfully',
                affectedRows: deleteResult.affectedRows,
            };
        }
    },

    // 更新商品数量
    updateQuantity: async (userId, cartId, productId, quantity) => {
        const query = `
            UPDATE Cart_Item
            SET Quantity = ?
            WHERE CartID = ? AND CartProductID = ?
        `;
        const [result] = await db.query(query, [quantity, cartId, productId]);
        if (result.affectedRows === 0) {
            return { success: false, message: 'Item not found or no changes made' };
        }
        return { success: true, message: 'Quantity updated successfully' };
    },

    // 根据用户ID查询购物车及商品
    getCartByUserId: async (userId) => {
        const query = `
            SELECT ci.CartItemID, ci.CartID, ci.CartProductID, ci.Quantity, 
                   p.*
            FROM Cart c
            JOIN Cart_Item ci ON c.CartID = ci.CartID
            JOIN product p ON ci.CartProductID = p.ProductID
            WHERE c.UserID = ?
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }
};

module.exports = Cart;