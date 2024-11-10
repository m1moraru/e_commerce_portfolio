// controllers/checkoutController.js
const db = require('../config/db'); // Database connection

// Checkout endpoint - handle the checkout process
exports.checkout = async (req, res) => {
    const { cartId } = req.params;

    try {
        // Step 1: Retrieve the cart and its items
        const cartResult = await db.query(
            'SELECT * FROM carts WHERE id = $1',
            [cartId]
        );

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cart = cartResult.rows[0];

        // Retrieve all items in the cart
        const cartItems = await db.query(
            'SELECT ci.product_id, ci.quantity, p.price, p.name FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
            [cartId]
        );

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Step 2: Simulate payment processing (assuming payment always succeeds for now)
        let totalAmount = 0;
        cartItems.rows.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        // Simulate payment processing (for now, assume all payments succeed)
        const paymentSuccessful = true; // Placeholder for actual payment logic
        if (!paymentSuccessful) {
            return res.status(500).json({ message: 'Payment failed' });
        }

        // Step 3: Create an order
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *',
            [cart.user_id, totalAmount]
        );

        const order = orderResult.rows[0];

        // Step 4: Create order items
        for (let item of cartItems.rows) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        // Step 5: Clear the cart (remove all cart items after order is placed)
        await db.query(
            'DELETE FROM cart_items WHERE cart_id = $1',
            [cartId]
        );

        // Step 6: Return the order details
        res.status(200).json({
            message: 'Checkout successful',
            order: {
                id: order.id,
                total_amount: order.total_amount,
                status: order.status,
                created_at: order.created_at,
                items: cartItems.rows
            }
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
