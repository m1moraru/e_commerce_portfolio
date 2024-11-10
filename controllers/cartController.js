// controllers/cartController.js
const db = require('../config/db'); // Database connection

// Create a new cart for the user
exports.createCart = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
            [userId]
        );
        res.status(201).json({ message: 'Cart created successfully', cart: result.rows[0] });
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a product to the user's cart
exports.addProductToCart = async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
        // Check if the product is already in the cart
        const existingProduct = await db.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cartId, productId]
        );

        if (existingProduct.rows.length > 0) {
            // If product already exists, update quantity
            const updatedProduct = await db.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
                [quantity, cartId, productId]
            );
            return res.status(200).json({ message: 'Product quantity updated', cartItem: updatedProduct.rows[0] });
        }

        // Add new product to the cart
        const result = await db.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [cartId, productId, quantity]
        );
        res.status(201).json({ message: 'Product added to cart', cartItem: result.rows[0] });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve the contents of the user's cart
exports.getCartContents = async (req, res) => {
    const { cartId } = req.params;
    try {
        const result = await db.query(
            'SELECT ci.id, ci.quantity, p.name, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1',
            [cartId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cart is empty or not found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving cart contents:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update the quantity of a product in the cart
exports.updateCartItemQuantity = async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
        const result = await db.query(
            'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
            [quantity, cartId, productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        res.status(200).json({ message: 'Product quantity updated', cartItem: result.rows[0] });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a product from the cart
exports.removeProductFromCart = async (req, res) => {
    const { cartId } = req.params;
    const { productId } = req.body;

    try {
        const result = await db.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *',
            [cartId, productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

