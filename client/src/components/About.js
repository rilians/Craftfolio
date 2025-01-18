import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function About() {
  const [about, setAbout] = useState(null);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/contact");
  };

  useEffect(() => {
    // Fetch about data
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/about`)
      .then((res) => setAbout(res.data))
      .catch((err) => console.error(err));

    // Initialize particles
    const initParticles = async () => {
      try {
        const particlesEngine = await loadFull();
        particlesEngine.load("tsparticles", {
          background: { color: { value: "#001F54" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
          },
          particles: {
            color: { value: "#FFFFFF" },
            links: {
              enable: true,
              distance: 150,
              color: "#00A6FB",
            },
            move: { enable: true, speed: 2 },
            size: { value: 3 },
          },
        });
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    };

    initParticles();

    // Cleanup particles when the component unmounts
    return () => {
      const container = document.getElementById("tsparticles");
      if (container) {
        container.innerHTML = ""; // Clear the particles container
      }
    };
  }, []);

  if (!about) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="relative">
      {/* Particles Background */}
      <div
        id="tsparticles"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />

      {/* About Section */}
      <motion.div
        className="min-h-screen bg-gradient-to-r from-[#001F54] to-[#00A6FB] text-white py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg text-black"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.img
              src={
                about.profilePicture
                  ? `${process.env.REACT_APP_BACKEND_URL}${about.profilePicture}`
                  : "https://via.placeholder.com/150"
              }
              className="w-32 h-32 mx-auto rounded-full mb-4 shadow-md border-4 border-[#FFC300]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <h1 className="text-4xl font-bold mb-2 text-[#001F54]">{about.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{about.description}</p>
          </div>

          {/* Skills Section */}
          <h2 className="text-2xl font-semibold mb-6 text-[#001F54]">Skills</h2>
          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {(about.skills || []).map((skill, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gradient-to-r from-[#00A6FB] to-[#FFC300] text-white rounded shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 1 }}
              >
                <h3 className="text-lg font-bold">{skill}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Me Button */}
          <div className="mt-10 text-center">
            <motion.button
              className="bg-gradient-to-r from-[#001F54] to-[#FFC300] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
              whileHover={{
                scale: 1.1,
                background: "linear-gradient(to right, #FFC300, #00A6FB)",
                boxShadow: "0px 0px 15px rgba(255, 195, 0, 0.5)",
              }}
              onClick={handleNavigate}
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default About;
