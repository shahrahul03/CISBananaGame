// models/GameRecord.js
const mongoose = require("mongoose");

const GameRecordSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameRecord", GameRecordSchema);
