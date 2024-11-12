// routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Retrieve all products or filter by category
router.get('/', productController.getAllProducts);

// Retrieve a single product by ID
router.get('/:productId', productController.getProductById);

// Retrieve products by category
router.get('/category/:category', productController.getProductsByCategory);

// Add a new product
router.post('/', productController.addProduct);

// Update a product by ID
router.put('/:productId', productController.updateProduct);

// Delete a product by ID
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
