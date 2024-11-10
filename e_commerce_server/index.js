// index.js

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');

// Initialize dotenv to access environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route to test the server
app.get('/', (req, res) => {
    res.send('Hello, welcome to the E-Commerce API!');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
