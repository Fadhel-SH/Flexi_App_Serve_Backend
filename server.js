// server.js
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
 const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
// require('./config/passport');




const app = express();

// Connect to MongoDB
require('./config/database');



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
    saveUninitialized: true, 
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) // Store sessions in MongoDB

}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/api/auth/google-login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/api/auth/google-callback', passport.authenticate('google'), (req, res) => {
   console.log(res);
    res.redirect('/'); // Redirect to your frontend or desired route
});

app.get('/api/profile', (req, res) => {
    res.send(req.user); // Send user profile
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});