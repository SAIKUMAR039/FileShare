// src/components/AnimatedHeroSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Auth from "./Auth";
import Features from "./Features";
import About from "./About";
import Footer from "./Footer";

const AnimatedHeroSection = ({ onGetStarted }) => {
  const [offsetY, setOffsetY] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Tooltip state

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="relative min-h-[calc(100vh-64px)] bg-gradient-to-b from-navy via-navy-light to-black">
        {/* Parallax Background Effect */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
        >
          <svg className="w-full h-full opacity-20">
            <pattern
              id="grid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
                Share Files Securely
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Transfer your files quickly and securely, anywhere in the world
              </p>
            </motion.div>

            {/* Auth Card positioned on the Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-md mx-auto mb-8"
            >
              <Auth /> {/* Auth component card */}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={onGetStarted}
              className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg font-bold text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              <span className="relative z-10">Start Sharing Now</span>
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Developer Info Badge with Tooltip */}
        <motion.a
          href="https://github.com/SAIKUMAR039"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 text-white bg-blue-600 rounded-full px-4 py-2 shadow-lg hover:bg-blue-500 transition-all duration-300 flex items-center space-x-2 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onMouseEnter={() => setIsHovered(true)} // Show tooltip on hover
          onMouseLeave={() => setIsHovered(false)} // Hide tooltip when not hovering
        >
          <span>Built by Sai Kumar</span>

          {/* Tooltip */}
          {isHovered && (
            <motion.div
              className="absolute bottom-12 right-0 w-64 bg-blue-700 text-white p-4 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">
                Check out my portfolio for more projects:
              </p>
              <a
                href="https://portfolio-sai-kumar.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline mt-2 block text-center"
              >
                View Portfolio
              </a>
            </motion.div>
          )}
        </motion.a>
      </section>
      <About />
      <Features />
      <Footer />
    </>
  );
};

export default AnimatedHeroSection;
