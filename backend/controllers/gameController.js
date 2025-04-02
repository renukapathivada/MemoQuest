const User = require("../models/User"); // Assuming you have a User model

// Controller function to handle score update
const updateGameScore = async (req, res) => {
    try {
        const { userId, score } = req.body;

        // Validate input
        if (!userId || !score) {
            return res.status(400).json({ success: false, message: "User ID and score are required" });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update latest score
        user.latestScore = score;

        // If the current score is higher than the highest score, update the highest score
        if (score > user.highestScore) {
            user.highestScore = score;
        }

        // Save the updated user data to the database
        await user.save();

        // Respond with a success message
        res.status(200).json({ success: true, message: "Score updated successfully" });

    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { updateGameScore };
