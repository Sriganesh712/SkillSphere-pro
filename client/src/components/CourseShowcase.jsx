import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";

export default function CourseShowcase() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        // Fetch top 3 courses — sorted by newest first
        const q = query(collection(db, "courses"), orderBy("title"), limit(3));
        const querySnapshot = await getDocs(q);
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching top courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Explore <span className="text-indigo-600">Trending Courses</span>
      </motion.h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading top courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid gap-10 md:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className="bg-gradient-to-br from-indigo-100 via-white to-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-200 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
                <PlayCircle className="text-indigo-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
