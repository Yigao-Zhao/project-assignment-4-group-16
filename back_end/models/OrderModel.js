const db = require('../config/mysql');
const { sendEmail } = require('../utils/emailService'); // 引入邮件服务模块

const Order = {
    addOrder: async (userId, items, cardDetails) => {
        // 假装校验银行卡信息
        if (!cardDetails || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        }
        console.log(1);

        const queryCartItems = `
            SELECT ci.CartItemID, ci.CartID, ci.CartProductID, ci.Quantity, 
                   p.ProductPrice, p.ProductStock, p.ProductName
            FROM Cart_Item ci
            JOIN product p ON ci.CartProductID = p.ProductID
            WHERE ci.CartItemID IN (?) AND ci.CartID = (
                SELECT CartID FROM Cart WHERE UserID = ?
            )
        `;
        const [cartItems] = await db.query(queryCartItems, [items, userId]);
        console.log(2);

        if (cartItems.length === 0) {
            throw new Error('Cart items not found');
        }

        const TAX_RATE = 0.13;
        const subtotal = cartItems.reduce((total, item) => total + item.ProductPrice * item.Quantity, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

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
        console.log(3);

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
        console.log(4);

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
        console.log(5);

        const deleteCartItemsQuery = `
            DELETE FROM Cart_Item
            WHERE CartItemID IN (?)
        `;
        await db.query(deleteCartItemsQuery, [items]);
        console.log(6);

        // 发送邮件
        const emailContent = `
            <h1>Thank you for your order!</h1>
            <p>Your order ID is: ${orderId}</p>
            <p>Order details:</p>
            <ul>
                ${cartItems
                    .map(
                        (item) =>
                            `<li>${item.ProductName} - Quantity: ${item.Quantity}, Price: $${item.ProductPrice.toFixed(
                                2
                            )}</li>`
                    )
                    .join('')}
            </ul>
            <p>Total: $${total.toFixed(2)}</p>
        `;
        const userQuery = `SELECT Email FROM user WHERE UserID = ?`;
        const [userRows] = await db.query(userQuery, [userId]);
        const userEmail = userRows[0].Email;
		console.log(userEmail)
        await sendEmail(userEmail, 'Order Confirmation', '', emailContent);

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