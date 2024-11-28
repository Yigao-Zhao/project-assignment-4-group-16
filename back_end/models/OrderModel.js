const db = require('../config/mysql');

const Order = {
    addOrder: async (userId, items, cardDetails) => {
        // 假装校验银行卡信息
        if (!cardDetails || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        }
		console.log(1)
        // 从 Cart_Item 表中查找对应的 cartItem 数据
        const queryCartItems = `
            SELECT ci.CartItemID, ci.CartID, ci.CartProductID, ci.Quantity, 
                   p.ProductPrice, p.ProductStock
            FROM Cart_Item ci
            JOIN product p ON ci.CartProductID = p.ProductID
            WHERE ci.CartItemID IN (?) AND ci.CartID = (
                SELECT CartID FROM Cart WHERE UserID = ?
            )
        `;
        const [cartItems] = await db.query(queryCartItems, [items, userId]);
console.log(2)
        if (cartItems.length === 0) {
            throw new Error('Cart items not found');
        }

        // 计算订单总价和税
        const TAX_RATE = 0.13;
        const subtotal = cartItems.reduce((total, item) => total + item.ProductPrice * item.Quantity, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        // 创建订单
        const insertOrderQuery = `
            INSERT INTO \`order\` (UserID, Subtotal, TaxRate, Total, OrderStatus, PaymentMethod, OrderDate)
            VALUES (?, ?, ?, ?, 'Pending', ?, NOW())
        `;
        const [orderResult] = await db.query(insertOrderQuery, [
            userId,
            subtotal,
            TAX_RATE,
            total,
            'Credit Card',
        ]);
        const orderId = orderResult.insertId;
console.log(3)
        // 插入订单项数据
        const insertOrderItemQuery = `
            INSERT INTO order_item (OrderID, OrderProductID, OrderProductQuantity, OrderProductSoldPrice)
            VALUES ?
        `;
        const orderItems = cartItems.map((item) => [
            orderId,
            item.CartProductID,
            item.Quantity,
            item.ProductPrice,
        ]);
        await db.query(insertOrderItemQuery, [orderItems]);
console.log(4)
        // 减少库存数量
        const updateProductStockQuery = `
            UPDATE product
            SET ProductStock = ProductStock - ?
            WHERE ProductID = ?
        `;
        for (const item of cartItems) {
            if (item.ProductStock < item.Quantity) {
                throw new Error(`Insufficient stock for product ID: ${item.CartProductID}`);
            }
            await db.query(updateProductStockQuery, [item.Quantity, item.CartProductID]);
        }
console.log(5)
        // 从购物车中删除对应的项
        const deleteCartItemsQuery = `
            DELETE FROM Cart_Item
            WHERE CartItemID IN (?)
        `;
        await db.query(deleteCartItemsQuery, [items]);
console.log(6)
        // 返回订单详情
        return {
            orderId,
            subtotal,
            tax,
            total,
            orderItems,
        };
    },
};

module.exports = Order;