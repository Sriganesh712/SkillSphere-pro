import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export default function MyEnrollments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const loadEnrollments = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const q = query(
        collection(db, "enrollments"),
        where("learnerId", "==", user.uid),
      );

      const snap = await getDocs(q);
      setEnrollments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    };

    loadEnrollments();
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrollments</h1>

      {enrollments.length === 0 && (
        <p className="text-gray-500">
          You haven’t enrolled in any courses yet.
        </p>
      )}

      <div className="space-y-4">
        {enrollments.map((enroll) => (
          <div
            key={enroll.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-medium">{enroll.courseTitle}</h2>

              <p
                className={`text-sm mt-1 ${
                  enroll.status === "approved"
                    ? "text-green-600"
                    : enroll.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {enroll.status === "approved" && "✅ Approved"}
                {enroll.status === "pending" && "⏳ Pending approval"}
                {enroll.status === "rejected" && "❌ Rejected"}
              </p>
            </div>

            {enroll.status === "approved" && (
              <button
                onClick={() =>
                  navigate(`/course/${enroll.courseId}`)
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
              >
                Go to Course
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
