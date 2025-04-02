const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Game", gameSchema);
