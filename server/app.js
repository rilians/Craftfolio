const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

dotenv.config();

const aboutRoute = require('./routes/about');
const projectsRoute = require("./routes/projects");
const contactRoute = require("./routes/contact");
const authRouter = require("./routes/auth");

const app = express(); // Deklarasikan app

// Middleware
app.use(cors({
    origin: ["https://craftfolio-five.vercel.app", "http://localhost:3000"], // Tambahkan localhost untuk pengujian
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use(bodyParser.json());

// Pastikan folder uploads ada
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Konfigurasi folder upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    },
});

const upload = multer({ storage });

// Endpoint upload gambar
app.post("/upload", upload.single("profilePicture"), (req, res) => {
    res.status(200).json({ filePath: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
});

// Endpoint untuk menyajikan file statis dari folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/about', aboutRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/auth", authRouter);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
