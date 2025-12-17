import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../components/Loader";

export default function BrowseCourses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "courses"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Courses</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">
          No courses available right now.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-1">
                {course.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {course.category} · {course.level}
              </p>

              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {course.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  By {course.educatorName}
                </span>

                <span className="text-indigo-600 font-medium">
                  View →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
