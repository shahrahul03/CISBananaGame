// routes/gameRoutes.js
const express = require("express");
const {
  saveGameRecord,
  getLeaderboard,
} = require("../controllers/gameController");

const router = express.Router();

// Save game record
router.post("/save", saveGameRecord);

// Get leaderboard
router.get("/leaderboard", getLeaderboard);

module.exports = router;
