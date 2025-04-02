const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        latestScore: {
            type: Number,
            default: 0,
        },
        highestScore: {
            type: Number,
            default: 0,
        },
        otp: {
            type: String,
            default: null
        },
        otpExpiry: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
