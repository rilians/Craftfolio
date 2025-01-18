import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Pastikan Navigate diimpor
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminPanel from "./components/AdminPanel"; // Pastikan file ini benar
import Login from "./components/Login"; // Pastikan jalur relatif ini sesuai dengan lokasi file Login.js


function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<About />} /> {/* Home mengarah ke About */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;