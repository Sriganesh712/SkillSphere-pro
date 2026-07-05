import React from "react";
import CoursesSection from "../components/CoursesSection";
import { motion } from "framer-motion";

export default function Courses() {
  return (
  <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-indigo-600">
          Explore Our Courses
        </h1>
        <CoursesSection />
      </div>
    </main>
  </motion.div>

  );
}
