// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Define the checkout route
router.post('/checkout/:cartId', checkoutController.checkout);

module.exports = router;
