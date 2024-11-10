// controllers/userController.js
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../config/db');

// Register a new user
exports.registerUser = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password, email, phone_number, address } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await db.query(
            `INSERT INTO users (name, username, password, email, phone_number, address) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, username, email, phone_number, address`,
            [name, username, hashedPassword, email, phone_number, address]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve all users (restricted access recommended)
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email, created_at FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve a specific user by ID
exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    try {
        // Update only the provided fields
        const fields = [];
        const values = [];
        let count = 1;

        if (username) {
            fields.push(`username = $${count}`);
            values.push(username);
            count++;
        }
        if (email) {
            fields.push(`email = $${count}`);
            values.push(email);
            count++;
        }
        if (password) {
            // Hash password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push(`password = $${count}`);
            values.push(hashedPassword);
            count++;
        }

        // Check if there are any fields to update
        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        values.push(userId); // Add userId as the last parameter for WHERE clause
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${count} RETURNING id, username, email, created_at`;
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Optionally, delete a user by ID
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};