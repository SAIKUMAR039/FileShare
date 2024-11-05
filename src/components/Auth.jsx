// src/components/Auth.jsx
import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase"; // Ensure Firebase is initialized properly
import { useNavigate } from "react-router-dom";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/upload");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/upload");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/upload");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-10 bg-white shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={isLogin ? handleEmailLogin : handleEmailSignup}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button type="submit" variant="primary" className="w-full">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>

      <div className="my-4 text-center">
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <FcGoogle className="mr-2" /> Sign in with Google
        </Button>
      </div>

      <div className="text-center text-sm mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 cursor-pointer"
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </div>
    </Card>
  );
};

export default Auth;
