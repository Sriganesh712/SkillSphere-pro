import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";


export default function LearnerProfile({ user }) {
  const navigate = useNavigate();
  if (!user || user.role !== "learner") {
    return null;
  }

  const [enrollments, setEnrollments] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearnerData = async () => {
      if (!user?.uid) return;
      const uid = user.uid;


      // 🔹 Load approved enrollments
      const enrollSnap = await getDocs(
        query(
          collection(db, "enrollments"),
          where("learnerId", "==", uid),
          where("status", "==", "approved")
        )
      );

      const enrollData = enrollSnap.docs.map((d) => d.data());
      setEnrollments(enrollData);

      // 🔹 Load progress for each course
      const progressMap = {};

      for (const enroll of enrollData) {
        const progressRef = doc(
          db,
          "progress",
          `${enroll.courseId}_${uid}`
        );
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          progressMap[enroll.courseId] =
            progressSnap.data().completedLessons?.length || 0;
        } else {
          progressMap[enroll.courseId] = 0;
        }
      }

      setCourseProgress(progressMap);
      setLoading(false);
    };

    loadLearnerData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Loading learning data...</p>
      </div>
    );
  }

  const enrolledCount = enrollments.length;

  const completedCount = enrollments.filter((e) => {
    const completedLessons =
      courseProgress[e.courseId] || 0;
    return completedLessons > 0; // refined later
  }).length;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold">My Learning</h2>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Enrolled" value={enrolledCount} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard
          label="Certificates"
          value={user.certificatesCount || 0}
        />
        <StatCard
          label="Active Courses"
          value={enrolledCount - completedCount}
        />
      </div>

      {/* COURSE LIST */}
      {enrollments.length === 0 ? (
        <p className="text-gray-500">
          You haven’t enrolled in any courses yet.
        </p>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enroll) => (
            <div
              key={enroll.courseId}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-medium">
                  {enroll.courseTitle}
                </h3>

                <p className="text-sm text-gray-500">
                  Progress:{" "}
                  {courseProgress[enroll.courseId] || 0} lessons
                  completed
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/course/${enroll.courseId}`)
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
              >
                Resume
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-gray-800">
        {value}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
