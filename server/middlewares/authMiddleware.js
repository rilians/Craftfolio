const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Authorization header missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
