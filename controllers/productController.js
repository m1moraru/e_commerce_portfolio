// controllers/productController.js
const db = require('../config/db'); // Database connection

// Get all products or filter by category
exports.getAllProducts = async (req, res) => {
    const category = req.query.category;
    try {
        const query = category
            ? 'SELECT * FROM public.products WHERE category = $1'
            : 'SELECT * FROM public.products';
        const values = category ? [category] : [];
        const result = await db.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific product by ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const result = await db.query('SELECT * FROM public.products WHERE id = $1', [productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params; // Get category from request parameters
    try {
        const result = await db.query(
            'SELECT * FROM public.products WHERE category = $1',
            [category]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No products found in the ${category} category` });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving products by category:', error); // Log the full error
        res.status(500).json({ message: 'Server error', error: error.message }); // Send error message in response
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO public.products (name, description, price, category, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, price, category, stock]
        );
        res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, category, stock } = req.body;
    try {
        const result = await db.query(
            'UPDATE public.products SET name = $1, description = $2, price = $3, category = $4, stock = $5 WHERE id = $6 RETURNING *',
            [name, description, price, category, stock, productId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const result = await db.query('DELETE FROM public.products WHERE id = $1 RETURNING *', [productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
