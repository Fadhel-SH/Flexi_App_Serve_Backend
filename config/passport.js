const passport = require('passport');
// new code below
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Utility function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
    User.findOne({ email: profile.emails[0].value }).then((existingUser) => {
        if (existingUser) {
            done(null, existingUser);
        } else {
            user = new User({
                displayName: profile.displayName,
                email: profile.emails[0].value,
                provider: "google",
                profilePicture: profile._json.picture
            }).save().then((newUser) => {
                done(null, newUser);
            });

                    // Generate token
        const token = generateToken(user);
        }
    });
}));
