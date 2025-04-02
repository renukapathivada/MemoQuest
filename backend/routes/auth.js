const express = require('express');
const router = express.Router();
const { registerUser, loginUser,forgotPassword, verifyOTP } = require('../controllers/authController');

// POST /register route
router.post('/register', registerUser);

// POST /login route
router.post('/login', loginUser);
// POST /forgot-password route
router.post('/forgot-password', forgotPassword);

// POST /verify-otp route to verify OTP and reset password
router.post('/verify-otp', verifyOTP);

module.exports = router;
