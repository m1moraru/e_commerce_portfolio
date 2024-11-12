// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming you have a database connection file

// GET /orders: Get all orders for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming user is authenticated and user info is attached to req.user

        const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error getting orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /orders/{orderId}: Get details of a specific order
router.get('/:orderId', async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming user is authenticated
        const orderId = req.params.orderId;

        // Query to get the order details
        const result = await db.query('SELECT * FROM orders WHERE order_id = $1 AND user_id = $2', [orderId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Query to get the order items
        const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

        res.status(200).json({
            order: result.rows[0],
            items: itemsResult.rows
        });
    } catch (err) {
        console.error('Error getting order details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
