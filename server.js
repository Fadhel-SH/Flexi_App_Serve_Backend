// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');




const app = express();

// Connect to MongoDB
require('./config/database.js');


// Connect to Passport
require('./config/passport');



// new code below
const User = require('./models/user');

// routes
const authRoutes = require('./routes/auth');


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/api/auth/login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/api/auth/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/'); // Redirect to your frontend or desired route
});

app.get('/api/profile', (req, res) => {
    res.send(req.user); // Send user profile
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});