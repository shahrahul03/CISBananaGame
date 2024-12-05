const express = require("express");
const userProfile = require("../controllers/UserProfileController");
const router = express.Router();

router.post("/userProfile", userProfile);

module.exports = router;
