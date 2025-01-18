const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config();

const aboutRoute = require('./routes/about');
const projectsRoute = require("./routes/projects");
const contactRoute = require("./routes/contact");
const authRouter = require("./routes/auth");

const app = express(); // Deklarasikan app



// Middleware
app.use(cors({
    origin: "https://craftfolio-five.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  
app.use(bodyParser.json());

// Routes
app.use('/api/about', aboutRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/auth", authRouter);

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
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
  });
  
  // Endpoint untuk menyajikan file statis dari folder uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  console.log('MongoDB URI:', process.env.MONGO_URI);




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
