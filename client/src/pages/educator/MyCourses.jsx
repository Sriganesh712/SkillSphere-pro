import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export default function MyCourses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const q = query(
        collection(db, "courses"),
        where("educatorId", "==", user.uid),
        orderBy("createdAt", "desc")
        );


      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(data);
      setLoading(false);
    };

    loadCourses();
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button
          onClick={() => navigate("/educator/create-course")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          + Create Course
        </button>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500 mb-4">
            You haven’t created any courses yet.
          </p>
          <button
            onClick={() => navigate("/educator/create-course")}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create your first course
          </button>
        </div>
      )}

      {/* Course Grid */}
      {courses.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-1">
                {course.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {course.category} · {course.level}
              </p>

              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {course.description}
              </p>

              <span
                className={`inline-block text-xs px-2 py-1 rounded ${
                  course.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {course.status}
              </span>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    navigate(`/educator/course/${course.id}`)
                  }
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Manage →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
