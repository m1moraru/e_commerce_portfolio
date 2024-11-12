// routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');
const router = express.Router();


// Create a new cart for the user
router.post('/', cartController.createCart);

// Add a product to an existing cart
router.post('/:cartId/add-item', cartController.addProductToCart);

// Add a product to an existing cart
//router.post('/:cartId', cartController.addProductToCart);

// Retrieve the contents of a cart
router.get('/:cartId', cartController.getCartContents);

// Update a product quantity in the cart
router.put('/:cartId', cartController.updateCartItemQuantity);

// Remove a product from the cart
router.delete('/:cartId', cartController.removeProductFromCart);

// Checkout a cart
router.post('/:cartId/checkout', checkoutController.checkout);

module.exports = router;
