import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅

export default function HeroSection() {
  const navigate = useNavigate(); // ✅

  const handleBrowseCourses = () => {
    navigate("/courses"); // ✅
  };

  return (
    <section className="min-h-[90vh] bg-white flex flex-col items-center justify-center text-center px-6 md:px-20 relative overflow-hidden">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Empower Your Learning Journey with <br />
        <span className="text-indigo-600">SkillSphere Pro</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Explore top-quality courses, AI-assisted tools, and a collaborative learning experience – all in one place.
      </motion.p>

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <button onClick={handleBrowseCourses} className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-500 transition duration-300">
          Get Started
        </button>
        <button
          onClick={handleBrowseCourses}
          className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition duration-300"
        >
          Browse Courses
        </button>
      </motion.div>
    </section>
  );
}
