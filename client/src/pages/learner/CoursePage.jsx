import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import EducatorModal from "./EducatorModal";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [pdfCount, setPdfCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [educatorCourseCount, setEducatorCourseCount] = useState(0);

  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [showEducator, setShowEducator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      // COURSE
      const courseSnap = await getDoc(doc(db, "courses", courseId));
      if (!courseSnap.exists()) return navigate("/dashboard");

      const courseData = courseSnap.data();
      setCourse(courseData);

      // LESSONS
      const lessonsSnap = await getDocs(
        query(
          collection(db, "courses", courseId, "lessons"),
          orderBy("order", "asc")
        )
      );
      setLessons(lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLessonsCount(lessonsSnap.size);

      // MATERIALS
      const pdfSnap = await getDocs(
        collection(db, "courses", courseId, "materials")
      );
      setPdfCount(pdfSnap.size);

      const assignSnap = await getDocs(
        collection(db, "courses", courseId, "assignments")
      );
      setAssignmentCount(assignSnap.size);

      // ENROLLMENT STATUS
      const enrollSnap = await getDocs(
        query(
          collection(db, "enrollments"),
          where("courseId", "==", courseId),
          where("learnerId", "==", user.uid)
        )
      );

      if (!enrollSnap.empty) {
        setEnrollmentStatus(enrollSnap.docs[0].data().status);
      }

      // EDUCATOR TOTAL COURSES
      if (courseData.educatorId) {
        const eduCourses = await getDocs(
          query(
            collection(db, "courses"),
            where("educatorId", "==", courseData.educatorId)
          )
        );
        setEducatorCourseCount(eduCourses.size);
      }

      setLoading(false);
    }

    loadData();
  }, [courseId, navigate]);

  const applyEnrollment = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "enrollments", `${courseId}_${user.uid}`), {
      courseId,
      learnerId: user.uid,
      educatorId: course.educatorId,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setEnrollmentStatus("pending");
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50">

      {/* ================= HERO ================= */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">
            {course.title}
          </h1>

          <p className="text-gray-300 max-w-4xl mb-4">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>📹 {lessonsCount} lessons</span>
            <span>📄 {pdfCount} PDFs</span>
            <span>📝 {assignmentCount} assignments</span>
            <span>⏱ {course.totalDuration}</span>
          </div>

          <button
            onClick={() => setShowEducator(true)}
            className="mt-4 text-indigo-400 hover:underline text-sm"
          >
            Created by @{course.educatorUsername}
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* COURSE CONTENT */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">
              Course content
            </h2>

            <div className="space-y-2">
              {lessons.map(l => (
                <div
                  key={l.id}
                  className="flex justify-between items-center border p-3 rounded text-sm"
                >
                  <span>{l.order}. {l.title}</span>
                  <span className="text-xs text-gray-500">
                    {enrollmentStatus === "approved" ? "🎬 Video" : "🔒 Locked"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">
              About this course
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {course.longDescription || course.description}
            </p>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white rounded-xl shadow border p-5 space-y-4">

            <img
              src={course.thumbnail}
              alt={course.title}
              className="rounded"
            />

            {!enrollmentStatus && (
              <button
                onClick={applyEnrollment}
                className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
              >
                Apply for Enrollment
              </button>
            )}

            {enrollmentStatus === "pending" && (
              <div className="text-yellow-600 font-medium text-center">
                ⏳ Enrollment Pending
              </div>
            )}

            {enrollmentStatus === "approved" && (
              <button
                onClick={() => navigate(`/course/${courseId}/watch`)}
                className="w-full bg-green-600 text-white py-3 rounded font-semibold"
              >
                Go to Course
              </button>
            )}

            {enrollmentStatus === "rejected" && (
              <div className="text-red-600 font-medium text-center">
                ❌ Enrollment Rejected
              </div>
            )}

            <div className="border-t pt-4 text-sm text-gray-600 space-y-2">
              <p>✔ Full lifetime access</p>
              <p>✔ Learn at your pace</p>
              <p>✔ Certificate on completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* EDUCATOR MODAL */}
      {showEducator && (
        <EducatorModal
          educatorId={course.educatorId}
          totalCourses={educatorCourseCount}
          onClose={() => setShowEducator(false)}
        />
      )}
    </div>
  );
}
