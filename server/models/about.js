const mongoose = require("mongoose");

// Definisi Schema
const aboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], required: true },
  profilePicture: { type: String, default: "" }, // Tambahkan untuk URL gambar
});

// Ekspor model
module.exports = mongoose.model("About", aboutSchema);
