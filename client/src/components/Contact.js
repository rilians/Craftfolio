import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Function to sanitize input data
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/[<>/"']/g, "").trim(); // Remove dangerous characters
};

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      return false;
    }

    // Email format validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);

    // Validate and sanitize data
    if (!validateForm()) {
      setError(true);
      return;
    }

    // Sanitizing inputs before sending to the server
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/contact", sanitizedData);
      if (res.status === 200) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Me</h1>
        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
            Thank you! Your message has been sent.
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            Oops! Something went wrong. Please try again.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Contact;