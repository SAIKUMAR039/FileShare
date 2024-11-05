import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import FileUpload from "./components/FileUpload";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import Auth from "./components/Auth";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
