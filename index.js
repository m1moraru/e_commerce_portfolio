const express = require('express');
const db = require('./config/db'); // Import the db connection
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passportConfig'); // Import configured passport
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json()); 

// Use CORS middleware
app.use(cors());

// Configure session middleware
app.use(
    session({
        secret: 'yourSecretKey', // Use a strong secret in production
        resave: false,
        saveUninitialized: false
    })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Import routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to check empty JSON body
app.use((req, res, next) => {
    if (req.is('json') && !req.body) {
        return res.status(400).send('Request body is empty');
    }
    next();
});

// Handling Invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON format');
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
