const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  // Extract Authorization header
  const authHeader = req.header("Authorization");
  // console.log("Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // console.error(
    //   'Authorization header is missing or does not start with "Bearer "'
    // );
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  // console.log("Extracted token:", token);

  if (!token) {
    // console.error("Token is missing");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);
    // req.user = decoded.user;
    req.user = { id: decoded.user.id };
    next();
  } catch (err) {
    // console.error("Token verification error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
