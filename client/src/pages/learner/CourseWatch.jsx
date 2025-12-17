import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../components/Loader";

export default function CourseWatch() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [enrollmentDocId, setEnrollmentDocId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // 1️⃣ Load course
        const courseSnap = await getDoc(doc(db, "courses", courseId));
        if (
          !courseSnap.exists() ||
          courseSnap.data().status !== "published"
        ) {
          navigate("/dashboard");
          return;
        }

        const courseData = courseSnap.data();
        setCourse(courseData);

        // 2️⃣ Check enrollment
        const enrollSnap = await getDocs(
          query(
            collection(db, "enrollments"),
            where("courseId", "==", courseId),
            where("learnerId", "==", user.uid)
          )
        );

        if (!enrollSnap.empty) {
          const docSnap = enrollSnap.docs[0];
          setEnrollmentStatus(docSnap.data().status);
          setEnrollmentDocId(docSnap.id);

          // 3️⃣ Load lessons ONLY if approved
          if (docSnap.data().status === "approved") {
            const lessonsSnap = await getDocs(
              query(
                collection(db, "courses", courseId, "lessons"),
                orderBy("order", "asc")
              )
            );

            const lessonData = lessonsSnap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));

            setLessons(lessonData);
            setActiveLesson(
              lessonData.find((l) => l.videoUrl) ||
                lessonData[0] ||
                null
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [courseId, navigate]);

  // 📨 Request enrollment
  const requestEnrollment = async () => {
    const user = auth.currentUser;
    if (!user || !course) return;

    const ref = await addDoc(collection(db, "enrollments"), {
      courseId,
      courseTitle: course.title,
      learnerId: user.uid,
      learnerName: user.displayName || "Learner",
      educatorId: course.educatorId,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setEnrollmentStatus("pending");
    setEnrollmentDocId(ref.id);
  };

  // ❌ Cancel enrollment request
  const cancelEnrollment = async () => {
    if (!enrollmentDocId) return;

    await deleteDoc(doc(db, "enrollments", enrollmentDocId));

    setEnrollmentStatus(null);
    setEnrollmentDocId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      {/* NOT ENROLLED */}
      {!enrollmentStatus && (
        <button
          onClick={requestEnrollment}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Request Enrollment
        </button>
      )}

      {/* PENDING */}
      {enrollmentStatus === "pending" && (
        <div className="flex items-center gap-4">
          <p className="text-yellow-600 font-medium">
            ⏳ Enrollment request pending approval
          </p>
          <button
            onClick={cancelEnrollment}
            className="text-sm text-red-600 underline"
          >
            Cancel request
          </button>
        </div>
      )}

      {/* REJECTED */}
      {enrollmentStatus === "rejected" && (
        <p className="text-red-600 font-medium">
          ❌ Enrollment request rejected
        </p>
      )}

      {/* APPROVED */}
      {enrollmentStatus === "approved" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* VIDEO PLAYER */}
          <div className="lg:col-span-3">
            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson.id}
                controls
                className="w-full rounded-lg shadow"
              >
                <source
                  src={activeLesson.videoUrl}
                  type="video/mp4"
                />
              </video>
            ) : (
              <div className="bg-gray-100 h-64 flex items-center justify-center rounded">
                No video available
              </div>
            )}

            {activeLesson && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">
                  {activeLesson.title}
                </h2>
                <p className="text-gray-600">
                  {activeLesson.description}
                </p>
              </div>
            )}
          </div>

          {/* LESSON LIST */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Lessons</h3>
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`cursor-pointer p-2 rounded ${
                    activeLesson?.id === lesson.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {lesson.order}. {lesson.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
