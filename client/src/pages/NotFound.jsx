import React from "react";
import { motion } from "framer-motion";
import { Bot, Home, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-center px-6 relative">

      {/* ROBOT ICON */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          duration: 0.6,
          repeat: 0,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="text-indigo-600 mb-4"
      >
        <Bot size={150} strokeWidth={1.6} />
      </motion.div>

      {/* 404 TEXT */}
      <motion.h1
        className="text-7xl font-extrabold text-gray-900 drop-shadow-sm"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-gray-600 mt-3 text-lg max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        This page seems to be missing.  
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeftCircle className="w-5 h-5" /> Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition"
        >
          <Home className="w-5 h-5" /> Home
        </button>
      </motion.div>
    </div>
  );
}
