const express = require("express");
const router = express.Router();
const path = require("path");
const Project = require(path.resolve(__dirname, "../models/projectModel"));
const Joi = require("joi");
const authMiddleware = require("../middlewares/authMiddleware");

// Schema untuk validasi input proyek
const projectSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  link: Joi.string().uri().required(),
  thumbnail: Joi.string().required(),
  category: Joi.string()
    .valid("All", "Frontend", "Backend", "Fullstack")
    .required(),
});

// Fungsi untuk validasi input proyek
const validateProject = (data) => {
  return projectSchema.validate(data);
};

// Endpoint untuk mendapatkan semua proyek berdasarkan kategori atau pencarian
router.get("/", async (req, res) => {
  const { category, search, page = 1, limit = 5 } = req.query;

  const query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  console.log("Fetching projects with query:", query); // Log query

  try {
    const totalProjects = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    console.log(`Fetched ${projects.length} projects.`); // Log jumlah proyek

    const totalPages = Math.ceil(totalProjects / limit);

    res.json({ projects, totalPages });
  } catch (err) {
    console.error("Error fetching projects:", err); // Log error
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Endpoint untuk menambahkan proyek baru
router.post("/", async (req, res) => {
  console.log("Received POST data:", req.body); // Log data yang diterima

  const { error } = validateProject(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message); // Log error validasi
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description, link, thumbnail, category } = req.body;

  try {
    const newProject = new Project({ title, description, link, thumbnail, category });
    await newProject.save();
    console.log("Project saved successfully:", newProject); // Log proyek yang disimpan
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error saving project:", err); // Log error penyimpanan
    res.status(500).json({ error: "Failed to add project" });
  }
});

// Endpoint untuk mengupdate proyek
router.put("/:id", async (req, res) => {
  console.log("Received PUT data:", req.body); // Log data yang diterima

  const { error } = validateProject(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message); // Log error validasi
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description, link, thumbnail, category } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, link, thumbnail, category },
      { new: true }
    );

    if (!updatedProject) {
      console.error("Project not found for update"); // Log jika proyek tidak ditemukan
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Project updated successfully:", updatedProject); // Log proyek yang diupdate
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err); // Log error update
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Endpoint untuk menghapus proyek
router.delete("/:id", async (req, res) => {
  console.log("Delete request for project ID:", req.params.id); // Log ID proyek

  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      console.error("Project not found for deletion"); // Log jika proyek tidak ditemukan
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Project deleted successfully:", deletedProject); // Log proyek yang dihapus
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting project:", err); // Log error hapus
    res.status(500).json({ error: "Failed to delete project" });
  }

  // Endpoint admin hanya bisa diakses jika token valid
router.get("/admin", authMiddleware, (req, res) => {
    res.json({ projects: [] }); // Ganti ini dengan logika data proyek Anda
  });

});

module.exports = router;
