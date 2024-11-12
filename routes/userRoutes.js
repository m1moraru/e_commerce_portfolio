// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const router = express.Router();

// Register route
router.post(
    '/register',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userController.registerUser
);

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        // Log in the user
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.status(200).json({ message: 'Logged in successfully', user: { id: user.id, username: user.username } });
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Clear session cookie
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});

// Check authentication status
router.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// Google login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("Google callback route accessed.");
        res.redirect('/'); // Redirect to the home page
    }
);

// Facebook login
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook callback route
router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/'); // Redirect to home page after successful login
    }
);

// Retrieve all users (for admin or internal use)
router.get('/', userController.getAllUsers);

// Retrieve a single user by ID
router.get('/:userId', userController.getUserById);

// Update a user by ID
router.put('/:userId', userController.updateUser);

// Optionally, delete a user by ID
router.delete('/:userId', userController.deleteUser);

module.exports = router;
