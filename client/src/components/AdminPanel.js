import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    thumbnail: "",
    category: "All",
  });
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized access. Redirecting to login.");
      navigate("/login");
      return;
    }

    fetchProjects(token);
  }, [navigate]);

  const fetchProjects = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects || []);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Redirecting to login.");
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingProject) {
        await axios.put(
          `http://localhost:5000/api/projects/${editingProject._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Project updated successfully");
        setEditingProject(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/projects", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects([...projects, res.data]);
      }
      setFormData({
        title: "",
        description: "",
        link: "",
        thumbnail: "",
        category: "All",
      });
      fetchProjects(token);
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== id));
      alert("Project deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 py-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Admin Panel: Manage Projects</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Form Tambah/Edit Proyek */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Project Link"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            rows="4"
            required
          />
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          >
            <option value="All">All</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
          </select>
          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-lg hover:shadow-xl transition"
          >
            {editingProject ? "Update Project" : "Add Project"}
          </button>
        </form>

        {/* Daftar Proyek */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Project List</h2>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-100 border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center shadow-lg"
              >
                <div className="text-left">
                  <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    onClick={() => {
                      setEditingProject(project);
                      setFormData({
                        title: project.title,
                        description: project.description,
                        link: project.link,
                        thumbnail: project.thumbnail,
                        category: project.category,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
