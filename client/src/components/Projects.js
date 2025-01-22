import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Ensure the styles.css file is correctly imported

const LoadingSpinner = () => <div className="spinner mx-auto"></div>;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories] = useState(["All", "Frontend", "Backend", "Fullstack"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // Number of projects per page confirmed here
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/projects?search=${search}&category=${selectedCategory}`)
      .then((res) => {
        const sortedProjects = (res.data.projects || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setProjects(sortedProjects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setIsLoading(false);
      });

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [search, selectedCategory, BACKEND_URL]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProjects = projects.filter((project) =>
    selectedCategory === "All" ? true : project.category === selectedCategory
  );

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white py-10">
      {/* UI elements (unchanged) */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Project Cards */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-200">No projects found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-purple-700 hover:bg-purple-800 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="mx-4">
          Page {currentProjects.length === 0 ? 0 : currentPage} of {Math.ceil(filteredProjects.length / projectsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(filteredProjects.length / projectsPerPage)}
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

