const mongoose = require("mongoose");

// Definisi schema untuk Project
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, required: true },
});

// Membuat model Project
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
