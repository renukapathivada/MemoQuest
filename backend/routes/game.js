const express = require("express");
const router = express.Router();
const { updateGameScore } = require("../controllers/gameController");

router.post("/update-score", updateGameScore);

module.exports = router;
