// controllers/gameController.js
const GameRecord = require("../models/GameRecord");

// Save game score
exports.saveGameRecord = async (req, res) => {
  const { username, score } = req.body;

  if (!username || score === undefined) {
    return res
      .status(400)
      .json({ message: "Username and score are required." });
  }

  try {
    // Check if a record exists for the username
    const existingRecord = await GameRecord.findOne({ username });

    if (existingRecord) {
      // Update the existing record with the new score
      existingRecord.score = score;
      await existingRecord.save();
      return res.status(200).json({ message: "Score updated successfully!" });
    }

    // Create a new record if none exists
    const newRecord = new GameRecord({ username, score });
    await newRecord.save();
    return res.status(201).json({ message: "Score saved successfully!" });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Error saving score", error });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameRecord.find().sort({ score: -1 }).limit(10);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};
