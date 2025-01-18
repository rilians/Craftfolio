const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Dummy user data
const users = [
  {
    id: 1,
    username: "rilians",
    password: "egiganteng123", // Gunakan ini hanya untuk pengujian (plaintext password)
  },
];

// Endpoint untuk login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Cari user berdasarkan username
  const user = users.find((u) => u.username === username);

  // Jika user tidak ditemukan atau password tidak sesuai
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Buat token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );

  // Kembalikan token ke klien
  res.json({ token });
});

module.exports = router;
