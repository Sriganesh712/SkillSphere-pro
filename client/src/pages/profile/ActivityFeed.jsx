import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function EducatorProfile({ user }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEducatorData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // 🔹 Load courses created by educator
      const coursesSnap = await getDocs(
        query(
          collection(db, "courses"),
          where("educatorId", "==", currentUser.uid)
        )
      );

      const courseData = coursesSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 🔹 Load enrollments for stats
      const enrollSnap = await getDocs(
        query(
          collection(db, "enrollments"),
          where("educatorId", "==", currentUser.uid)
        )
      );

      const enrollments = enrollSnap.docs.map((d) => d.data());

      setCourses(courseData);

      setStats({
        totalCourses: courseData.length,
        publishedCourses: courseData.filter(
          (c) => c.status === "published"
        ).length,
        totalStudents: enrollments.filter(
          (e) => e.status === "approved"
        ).length,
        pendingRequests: enrollments.filter(
          (e) => e.status === "pending"
        ).length,
      });

      setLoading(false);
    };

    loadEducatorData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">
          Loading educator profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold">
        Educator Dashboard
      </h2>

      {/* IDENTITY */}
      <div className="grid md:grid-cols-2 gap-4">
        <Info label="Educator Type" value={user.educatorType || "—"} />
        <Info label="Organization" value={user.organization || "—"} />
        <Info
          label="Experience"
          value={
            user.experienceYears
              ? `${user.experienceYears}+ years`
              : "—"
          }
        />
        <Info
          label="Expertise"
          value={
            user.expertise?.length
              ? user.expertise.join(", ")
              : "—"
          }
        />
      </div>

      {/* SOCIAL LINKS */}
      <div className="flex gap-4 text-sm">
        {user.linkedin && (
          <a
            href={user.linkedin}
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            LinkedIn
          </a>
        )}
        {user.github && (
          <a
            href={user.github}
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            GitHub
          </a>
        )}
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            Website
          </a>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Courses" value={stats.totalCourses} />
        <StatCard
          label="Published"
          value={stats.publishedCourses}
        />
        <StatCard
          label="Students"
          value={stats.totalStudents}
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingRequests}
        />
      </div>

      {/* COURSES LIST */}
      <div>
        <h3 className="font-medium mb-3">
          My Courses
        </h3>

        {courses.length === 0 ? (
          <p className="text-gray-500">
            You haven’t created any courses yet.
          </p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">
                    {course.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/educator/course/${course.id}`
                    )
                  }
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
