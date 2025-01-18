import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";

function App() {
  const token = localStorage.getItem("token"); // Menggunakan token sebagai validasi login
  const isLoggedIn = !!token;

  return (
    <Router>
      <Routes>
        {/* Home (About Page) */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <About />
            </>
          }
        />
        {/* Projects Page */}
        <Route
          path="/projects"
          element={
            <>
              <Header />
              <Projects />
            </>
          }
        />
        {/* Contact Page */}
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
            </>
          }
        />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        {/* Admin Page */}
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
        />
        {/* Fallback Route */}
        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
