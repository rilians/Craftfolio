const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Dummy user data
const users = [
  {
    id: 1,
    username: "rilians",
    password: "egiganteng123", // In real-world apps, use hashed passwords!
  },
];

// Endpoint for login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

  // Dummy login logic
  if (username === "rilians" && password === "egiganteng123") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "secretkey",
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

module.exports = router;
