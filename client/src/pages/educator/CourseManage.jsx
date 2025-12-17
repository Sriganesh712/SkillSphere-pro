import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { uploadVideoToCloudinary } from "../../utils/cloudinary";

export default function CourseManage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploadingLessonId, setUploadingLessonId] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const courseRef = doc(db, "courses", courseId);
      const snap = await getDoc(courseRef);

      // ❌ Block non-owners
      if (!snap.exists() || snap.data().educatorId !== user.uid) {
        navigate("/educator/my-courses");
        return;
      }

      setCourse({ id: snap.id, ...snap.data() });

      const lessonsSnap = await getDocs(
        query(
          collection(db, "courses", courseId, "lessons"),
          orderBy("order", "asc")
        )
      );

      setLessons(
        lessonsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    };

    init();
  }, [courseId, navigate]);

  const handleVideoUpload = async (lessonId, file) => {
    if (!file) return;

    // ✅ Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file");
      return;
    }

    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson?.videoUrl) {
      const confirmReplace = window.confirm(
        "This lesson already has a video. Replace it?"
      );
      if (!confirmReplace) return;
    }

    try {
      setUploadingLessonId(lessonId);

      // 1️⃣ Upload to Cloudinary
      const videoUrl = await uploadVideoToCloudinary(file);

      // 2️⃣ Save URL to Firestore
      const lessonRef = doc(
        db,
        "courses",
        courseId,
        "lessons",
        lessonId
      );

      await updateDoc(lessonRef, { videoUrl });

      // 3️⃣ Update UI
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ? { ...l, videoUrl } : l
        )
      );
    } catch (err) {
      console.error(err);
      alert("Video upload failed");
    } finally {
      setUploadingLessonId(null);
    }
  };

  const addLesson = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "courses", courseId, "lessons"), {
      title,
      description,
      videoUrl: null,
      order: lessons.length + 1,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setDescription("");

    const snap = await getDocs(
      query(
        collection(db, "courses", courseId, "lessons"),
        orderBy("order", "asc")
      )
    );

    setLessons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
            <p className="text-gray-500">{course.description}</p>

            <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                course.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
            >
            {course.status}
            </span>
        </div>

        <button
            onClick={async () => {
            const newStatus =
                course.status === "published" ? "draft" : "published";

            await updateDoc(doc(db, "courses", course.id), {
                status: newStatus,
            });

            setCourse((prev) => ({ ...prev, status: newStatus }));
            }}
            className={`px-4 py-2 rounded text-white ${
            course.status === "published"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
        >
            {course.status === "published"
            ? "Unpublish Course"
            : "Publish Course"}
        </button>
        </div>


      {/* ADD LESSON */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold mb-4">Add Lesson</h2>

        <form onSubmit={addLesson} className="space-y-4">
          <input
            placeholder="Lesson title"
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Lesson description"
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
            Add Lesson
          </button>
        </form>
      </div>

      {/* LESSON LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Lessons</h2>

        {lessons.length === 0 && (
          <p className="text-gray-500">No lessons yet.</p>
        )}

        <ul className="space-y-4">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">
                  {lesson.order}. {lesson.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {lesson.description}
                </p>

                {lesson.videoUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    🎬 Video uploaded
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="video/*"
                  disabled={uploadingLessonId === lesson.id}
                  onChange={(e) =>
                    handleVideoUpload(
                      lesson.id,
                      e.target.files[0]
                    )
                  }
                />

                {uploadingLessonId === lesson.id && (
                  <span className="text-xs text-gray-400">
                    Uploading...
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
