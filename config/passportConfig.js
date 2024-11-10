// config/passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db'); // Database connection

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username', // Maps to req.body.username
            passwordField: 'password'  // Maps to req.body.password
        },
        async (username, password, done) => {
            try {
                // Retrieve user from database
                const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
                const user = result.rows[0];

                // If user not found
                if (!user) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                // Compare hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                // Successful authentication
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize and deserialize user (for session handling)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
