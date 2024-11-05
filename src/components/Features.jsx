// src/components/Features.jsx
import React from "react";
import { motion } from "framer-motion";
import { FileText, Shield, User } from "lucide-react"; // Import the icons here

const featureData = [
  {
    icon: <FileText />,
    title: "Secure Transfer",
    description: "Share files with end-to-end encryption.",
  },
  {
    icon: <Shield />,
    title: "Data Protection",
    description: "Keep your data safe with advanced security.",
  },
  {
    icon: <User />,
    title: "User Friendly",
    description: "Easy to use interface for everyone.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-12 bg-gradient-to-b from-gray-900 to-navy-light"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Features
        </h2>
        <motion.div
          className="flex flex-wrap justify-center gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            hidden: { opacity: 0 },
          }}
        >
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              className="max-w-xs text-center p-4 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl text-blue-600 mb-2">{feature.icon}</div>
              <h3 className="text-xl font-bold text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
