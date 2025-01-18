const express = require("express");
const About = require("../models/about");

const router = express.Router();

// Endpoint untuk mendapatkan data
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.status(200).json(about);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch about data." });
  }
});

module.exports = router;
