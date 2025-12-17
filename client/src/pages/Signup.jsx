import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import illustration from "../assets/signup-illustration.png";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return unsubscribe;
  }, [navigate]);

  // 🧠 Friendly error messages
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/operation-not-allowed":
        return "Email/Password sign-up is disabled in Firebase Console.";
      default:
        return "Signup failed. Please try again.";
    }
  };

  // ✅ EMAIL SIGNUP (FIXED)
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/complete-profile");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg(getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGNUP (FIXED)
  const handleGoogleSignup = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/complete-profile");
    } catch (error) {
      console.error("Google signup error:", error);
      setErrorMsg(getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex w-full overflow-hidden"
    >
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-100 to-yellow-100 items-center justify-center">
        <img
          src={illustration}
          alt="Signup Illustration"
          className="w-2/3 max-w-md"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Start your journey with us
        </p>

        {/* 🔄 Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        )}

        <form
          onSubmit={handleSignup}
          className={`space-y-4 transition-opacity ${
            loading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <button
            onClick={handleGoogleSignup}
            type="button"
            disabled={loading}
            className="w-full border border-gray-300 flex justify-center items-center gap-2 py-2 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </motion.div>
  );
}
