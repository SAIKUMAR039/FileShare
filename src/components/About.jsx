// src/components/About.jsx
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-12 bg-navy text-white text-center">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-lg max-w-2xl mx-auto">
          We are dedicated to providing a secure and reliable platform for
          sharing files. Our mission is to ensure the privacy and safety of your
          data as you transfer files around the world.
        </p>
      </motion.div>
    </section>
  );
};

export default About;
