import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../components/Loader";
import { uploadFileToCloudinary } from "../../utils/cloudinary";

export default function CourseWatch() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});

  const [completedLessons, setCompletedLessons] = useState([]);
  const [lastTime, setLastTime] = useState(0);

  const [tab, setTab] = useState("Overview");
  const [uploadingAssignment, setUploadingAssignment] = useState(null);

  // 🔐 AUTH + LOAD DATA
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/login");

      try {
        // COURSE
        const courseSnap = await getDoc(doc(db, "courses", courseId));
        if (!courseSnap.exists()) return navigate("/dashboard");
        setCourse(courseSnap.data());

        // ENROLLMENT CHECK
        const enrollSnap = await getDocs(
          query(
            collection(db, "enrollments"),
            where("courseId", "==", courseId),
            where("learnerId", "==", user.uid),
            where("status", "==", "approved")
          )
        );
        if (enrollSnap.empty) return navigate("/dashboard");

        // LESSONS
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
        setActiveLesson(lessonData[0]);

        // PROGRESS
        const progressSnap = await getDoc(
          doc(db, "progress", `${courseId}_${user.uid}`)
        );
        if (progressSnap.exists()) {
          setCompletedLessons(progressSnap.data().completedLessons || []);
          setLastTime(progressSnap.data().lastWatchedTime || 0);
        }

        // 📄 PDF MATERIALS
        const pdfSnap = await getDocs(
          query(
            collection(db, "courses", courseId, "materials"),
            where("published", "==", true)
          )
        );
        setMaterials(pdfSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // 📝 ASSIGNMENTS
        const assignSnap = await getDocs(
          query(
            collection(db, "courses", courseId, "assignments"),
            where("published", "==", true)
          )
        );
        const assigns = assignSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAssignments(assigns);

        // 📤 SUBMISSIONS
        const subs = {};
        for (const a of assigns) {
          const subSnap = await getDoc(
            doc(
              db,
              "courses",
              courseId,
              "assignments",
              a.id,
              "submissions",
              user.uid
            )
          );
          if (subSnap.exists()) subs[a.id] = subSnap.data();
        }
        setSubmissions(subs);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [courseId, navigate]);

  // ▶ Resume playback
  useEffect(() => {
    if (videoRef.current && lastTime) {
      videoRef.current.currentTime = lastTime;
    }
  }, [activeLesson, lastTime]);

  // SAVE VIDEO TIME
  const saveTime = async () => {
    const user = auth.currentUser;
    if (!user || !videoRef.current) return;

    await updateDoc(doc(db, "progress", `${courseId}_${user.uid}`), {
      lastWatchedTime: videoRef.current.currentTime,
    });
  };

  // MARK LESSON COMPLETE
  const markCompleted = async () => {
    const user = auth.currentUser;
    if (!user || !activeLesson) return;

    await setDoc(
      doc(db, "progress", `${courseId}_${user.uid}`),
      {
        completedLessons: arrayUnion(activeLesson.id),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setCompletedLessons((p) =>
      p.includes(activeLesson.id) ? p : [...p, activeLesson.id]
    );
  };

  // 📤 ASSIGNMENT SUBMISSION
  const submitAssignment = async (assignmentId, file) => {
    if (!file) return;
    const user = auth.currentUser;
    setUploadingAssignment(assignmentId);

    try {
      const fileUrl = await uploadFileToCloudinary(file);

      await setDoc(
        doc(
          db,
          "courses",
          courseId,
          "assignments",
          assignmentId,
          "submissions",
          user.uid
        ),
        {
          learnerId: user.uid,
          fileUrl,
          fileName: file.name,
          submittedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: { fileName: file.name, fileUrl },
      }));
    } catch {
      alert("Assignment upload failed");
    } finally {
      setUploadingAssignment(null);
    }
  };

  if (loading) return <Loader />;
async function forceDownloadPdf(url, filename = "file.pdf") {
  const res = await fetch(url);
  const blob = await res.blob();

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

  const progress =
    lessons.length > 0
      ? Math.round((completedLessons.length / lessons.length) * 100)
      : 0;

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* VIDEO + CONTENT */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              controls
              className="w-full max-h-[70vh]"
              onTimeUpdate={saveTime}
              onEnded={markCompleted}
            >
              <source src={activeLesson?.videoUrl} type="video/mp4" />
            </video>
          </div>

          <h1 className="text-xl font-bold mt-4">
            {activeLesson?.title}
          </h1>
          <p className="text-gray-600">{activeLesson?.description}</p>

          {/* PROGRESS */}
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-indigo-600 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress}% completed
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-6 mt-6 border-b">
            {["Overview", "PDFs", "Assignments"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 font-medium ${
                  tab === t
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "Overview" && (
            <p className="mt-4 text-gray-700">{course.description}</p>
          )}

          {/* PDFs */}
          {tab === "PDFs" && (
            <div className="mt-4 space-y-3">
              {materials.length === 0 && (
                <p className="text-gray-500">No PDFs available.</p>
              )}

              {materials.map((pdf) => (
                <div
                  key={pdf.id}
                  className="border p-4 rounded flex justify-between"
                >
                  <span>{pdf.name || "Course Material"}</span>
                  <button
                    onClick={() => forceDownloadPdf(pdf.fileUrl, pdf.name)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-500"
                  >
                    Download
                  </button>

                </div>
              ))}
            </div>
          )}

          {/* ASSIGNMENTS */}
          {tab === "Assignments" && (
            <div className="mt-4 space-y-4">
              {assignments.length === 0 && (
                <p className="text-gray-500">No assignments yet.</p>
              )}

              {assignments.map((a) => (
                <div key={a.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.description}</p>

                  {submissions[a.id] ? (
                    <p className="text-green-600 text-sm mt-2">
                      ✅ Submitted: {submissions[a.id].fileName}
                    </p>
                  ) : (
                    <input
                      type="file"
                      className="mt-3"
                      disabled={uploadingAssignment === a.id}
                      onChange={(e) =>
                        submitAssignment(a.id, e.target.files[0])
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LESSON LIST */}
        <aside className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Lessons</h3>
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li
                key={l.id}
                onClick={() => setActiveLesson(l)}
                className={`p-2 rounded cursor-pointer ${
                  activeLesson?.id === l.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {l.order}. {l.title}
                {completedLessons.includes(l.id) && " ✔"}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
