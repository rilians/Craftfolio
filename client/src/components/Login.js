import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Use environment variable for backend URL or fallback to localhost
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const validateForm = () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and password are required.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        username: username.trim(),
        password: password.trim(),
      });

      const { token } = response.data;

      // Save token securely in localStorage
      localStorage.setItem("token", token);

      // Navigate to admin page on success
      alert("Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("Error during login:", err);

      // Handle specific error status
      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage("Invalid username or password.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setErrorMessage("Unable to connect to the server. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Login
        </h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-6 rounded-lg hover:shadow-xl transition transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
