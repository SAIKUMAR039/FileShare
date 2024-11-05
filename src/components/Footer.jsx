// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Sai Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
