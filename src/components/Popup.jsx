import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
const Popup = ({ togglePopup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const switchMode = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      togglePopup();
      toast.success("Logged in successfully");
      navigate("/upload");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Error signing in with Google");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      togglePopup();
      toast.success("Authentication successful");
      navigate("/upload");
    } catch (error) {
      console.error("Error with email/password authentication:", error);
      toast.error("Error with email/password authentication");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96 text-white">
        <button
          onClick={togglePopup}
          className="absolute top-2 right-2 text-white hover:text-gray-300 bg-black hover:bg-gray-800 p-2 rounded-full"
        >
          X
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-navy text-white py-2 rounded mb-4 flex items-center justify-center gap-2"
        >
          <FcGoogle size={20} /> Continue with Google
        </button>
        <br />
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <br />

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full bg-navy text-white py-2 rounded mb-4"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Popup;
