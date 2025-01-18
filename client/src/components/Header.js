import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-white text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform"
            >
              Craft<span className="text-yellow-300">folio</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            >
              Projects
            </Link>

            <Link
              to="/contact"
              className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            >
              Contact
            </Link>
            {/* Admin Panel Link */}
            <Link
              to="/admin"
              className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            >
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-yellow-300 focus:outline-none transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 space-y-2 shadow-lg">
          <Link
            to="/"
            className="block text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/projects"
            className="block text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className="block text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            Contact
          </Link>
          <Link
            to="/admin"
            className="block text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
