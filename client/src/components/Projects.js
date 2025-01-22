import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Pastikan file styles.css diimpor dengan benar

const LoadingSpinner = () => (
  <div className="spinner mx-auto"></div>
);

function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All", "Frontend", "Backend", "Fullstack"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/projects?page=${currentPage}&limit=5&search=${search}&category=${selectedCategory}`)
      .then((res) => {
        setProjects(res.data.projects);
        setTotalPages(res.data.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, search, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat pencarian berubah
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat kategori berubah
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white py-10">
      <h1 className="text-4xl font-bold text-center mb-10">My Projects</h1>

      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={handleSearchChange}
          className="p-2 bg-white text-black rounded shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="text-center mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 bg-white text-black rounded shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-4 text-gray-800">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                {project.description}
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 mt-4 block font-semibold"
              >
                View Project
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-200">No projects found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || projects.length === 0}
          className="p-2 bg-purple-700 hover:bg-purple-800 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="mx-4">Page {projects.length === 0 ? 0 : currentPage} of {projects.length === 0 ? 0 : totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || projects.length === 0}
          className="p-2 bg-purple-700 hover:bg-purple-800 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 bg-indigo-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:bg-indigo-800"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Projects;
