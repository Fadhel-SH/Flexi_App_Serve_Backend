const express = require('express');
const { register, login, googleLogin, facebookLogin, appleLogin } = require('../config/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);
router.get('/facebook', facebookLogin);
router.post('/apple', appleLogin);

module.exports = router;