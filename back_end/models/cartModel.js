const db = require('../config/mysql');

const Cart = {
    // add a new item to the cart
    addItem: async (userId, quantity, productId) => {
        // get CartID from UserID
    
        // query to check if the user has a cart
        let query = `SELECT CartID FROM Cart WHERE UserID = ?`;
        const [cartRows] = await db.query(query, [userId]);
    
        let cartId;
    
        if (cartRows.length > 0) {
            // if record exists, get the CartID
            cartId = cartRows[0].CartID;
        } else {
            // if record does not exist, create a new cart
            query = `INSERT INTO Cart (UserID) VALUES (?)`;
            console.log('SQL Query (Insert Cart):', query, [userId]);
            const [result] = await db.query(query, [userId]);
            cartId = result.insertId; // get the CartID of the newly created cart
        }
    
        // check if the item already exists in the cart
        query = `SELECT Quantity FROM Cart_Item WHERE CartID = ? AND CartProductID = ?`;
        const [itemRows] = await db.query(query, [cartId, productId]);
    
        if (itemRows.length > 0) {
            // if record exists, update the quantity
            query = `
               UPDATE Cart_Item
               SET Quantity = LEAST(Quantity + 1, (SELECT ProductStock FROM product WHERE ProductID = CartProductID))
               WHERE CartID = ? AND CartProductID = ?
            `;
            console.log('SQL Query (Update Cart_Item):', query, [cartId, productId]);
            await db.query(query, [ cartId, productId]);
        } else {
            // if record does not exist, insert a new record
            query = `
                INSERT INTO Cart_Item (CartID, CartProductID, Quantity)
                VALUES (?, ?, 1)
            `;
            console.log('SQL Query (Insert Cart_Item):', query, [cartId, productId, quantity]);
            await db.query(query, [cartId, productId, quantity]);
        }
    
        return { cartId, productId, quantity };
    },

    // delete an item from the cart
    removeItem: async (userId,a, productId) => {
        // get CartID from UserID
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
		
        // query the quantity of the item in the cart
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
            // if quantity is greater than 1, decrease the quantity by 1
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
            // if quantity is 1, delete the item from the cart
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

    // update the quantity of an item in the cart
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

    // get all items in the cart by UserID
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