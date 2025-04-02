const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register user function
const registerUser = async (req, res) => {
    const { name, email, password, phone, dob, gender } = req.body;
    console.log('Received registration data:', req.body); // Log the incoming data

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            dob,
            gender,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log('User registered successfully:', user); // Log user creation
        res.status(201).json({ success: true, message: "User registered successfully!", token });
    } catch (error) {
        console.error('Error during user registration:', error); // Log error
        res.status(500).json({ success: false, message: "An error occurred while registering the user." });
    }
};



// Login user function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: { id: user._id }  // Add the user ID here
        });
        } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function to send OTP via email
const sendOTPEmail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Allow insecure connection (optional)
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Forgot Password: Generate OTP and send email
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate OTP and set expiry
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Store OTP and expiry in the user record
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again later.' });
    }
};

// Verify OTP and reset password
const verifyOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear OTP and expiry after successful password reset
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP or reset password' });
    }
};
module.exports = { registerUser, loginUser, forgotPassword, verifyOTP };
