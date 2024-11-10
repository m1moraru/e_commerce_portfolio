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
        body('name').notEmpty().withMessage('Name is required'),
        body('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('phone_number').isMobilePhone().optional().withMessage('Invalid phone number'),
        body('address').isString().optional().withMessage('Address must be a string')
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

// Retrieve all users (for admin or internal use)
router.get('/', userController.getAllUsers);

// Retrieve a single user by ID
router.get('/:userId', userController.getUserById);

// Update a user by ID
router.put('/:userId', userController.updateUser);

// Optionally, delete a user by ID
router.delete('/:userId', userController.deleteUser);

module.exports = router;


