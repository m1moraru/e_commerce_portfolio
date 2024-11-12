// config/passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db'); // Database connection

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email', // Change to 'email' to match the login form
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                console.log("Email:", email);
                console.log("Password:", password); // Log incoming password
                // Retrieve user from database using email
                const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
                const user = result.rows[0];

                if (!user) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                // Compare hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/users/auth/google/callback"
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists in the database
      const result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      let user = result.rows[0];

      // If user doesn't exist, create a new one
      if (!user) {
        const insertResult = await db.query(
          'INSERT INTO users (username, google_id) VALUES ($1, $2) RETURNING *',
          [profile.displayName, profile.id]
        );
        user = insertResult.rows[0];
      }

      // Pass the user to the serialize function
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE facebook_id = $1', [profile.id]);
        let user = result.rows[0];

        if (!user) {
            const insertResult = await db.query(
                'INSERT INTO users (username, facebook_id) VALUES ($1, $2) RETURNING *',
                [profile.displayName, profile.id]
            );
            user = insertResult.rows[0];
        }

        return done(null, user);
    } catch (error) {
        return done(error);
   }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Store the user's ID in the session
});
  
// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      done(null, user);
    } catch (error) {
      done(error, null);
    }
});

module.exports = passport;