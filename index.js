const express = require('express');
const db = require('./config/db'); // Import the db connection
const session = require('express-session');
const passport = require('./config/passportConfig'); // Import configured passport
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests

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

// Import routes (make sure routes use `passport`)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cart', cartRoutes);

app.use((req, res, next) => {
    if (req.is('json') && !req.body) {
        return res.status(400).send('Request body is empty');
    }
    next();
});

//Handling Invalid JSON (Middleware)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).send('Invalid JSON format');
    }
    next();
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
