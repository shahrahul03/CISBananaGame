const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("../src/routes/authRoutes");
const cors = require("cors");
const profileRoutes = require("../src/routes/profileRoutes");

const userProfileRoutes = require("../src/routes/userProfileRoutes");
const gameRoutes = require("./routes/gameRoutes");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoURI = "mongodb://127.0.0.1:27017/BananaGame";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.use("/user", userProfileRoutes);
app.use("/api/auth/", authRoutes);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/profile", profileRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/game", gameRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
