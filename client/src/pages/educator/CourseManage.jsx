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
  deleteDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import {
  uploadVideoToCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinary";

/* ======================================================
   COURSE MANAGE — EDUCATOR STUDIO (PRO LEVEL)
====================================================== */

export default function CourseManage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  /* ---------------- CORE STATE ---------------- */
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("lessons");

  /* ---------------- DATA ---------------- */
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);

  /* ---------------- FORMS ---------------- */
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [uploadingLessonId, setUploadingLessonId] = useState(null);

  /* ======================================================
     INITIAL LOAD & AUTH
  ====================================================== */
  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      const courseSnap = await getDoc(doc(db, "courses", courseId));
      if (!courseSnap.exists()) return navigate("/educator/my-courses");

      const courseData = courseSnap.data();
      if (courseData.educatorId !== user.uid)
        return navigate("/educator/my-courses");

      setCourse({ id: courseSnap.id, ...courseData });
      await reloadAll();
      setLoading(false);
    };

    init();
  }, [courseId, navigate]);

  const reloadAll = async () => {
    const load = async (path, setter) => {
      const snap = await getDocs(
        query(
          collection(db, "courses", courseId, path),
          orderBy("createdAt", "asc")
        )
      );
      setter(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    await load("lessons", setLessons);
    await load("materials", setMaterials);
    await load("assignments", setAssignments);
  };

  /* ======================================================
     COURSE CONTROLS
  ====================================================== */
  const toggleCourseStatus = async () => {
    const newStatus = course.status === "published" ? "draft" : "published";
    await updateDoc(doc(db, "courses", course.id), { status: newStatus });
    setCourse(prev => ({ ...prev, status: newStatus }));
  };

  /* ======================================================
     LESSONS
  ====================================================== */
  const createLesson = async () => {
    if (!lessonForm.title.trim()) return alert("Lesson title required");

    await addDoc(collection(db, "courses", courseId, "lessons"), {
      title: lessonForm.title,
      description: lessonForm.description,
      order: lessons.length + 1,
      videoUrl: null,
      createdAt: serverTimestamp(),
    });

    setLessonForm({ title: "", description: "" });
    reloadAll();
  };

  const uploadLessonVideo = async (lessonId, file) => {
    if (!file || !file.type.startsWith("video/")) {
      return alert("Please upload a valid video file");
    }

    try {
      setUploadingLessonId(lessonId);
      const videoUrl = await uploadVideoToCloudinary(file);
      await updateDoc(
        doc(db, "courses", courseId, "lessons", lessonId),
        { videoUrl }
      );
      reloadAll();
    } finally {
      setUploadingLessonId(null);
    }
  };

  const updateLesson = async (lessonId, field, value) => {
    await updateDoc(
      doc(db, "courses", courseId, "lessons", lessonId),
      { [field]: value }
    );
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Delete lesson permanently?")) return;
    await deleteDoc(doc(db, "courses", courseId, "lessons", lessonId));
    reloadAll();
  };

  /* ======================================================
     PDF MATERIALS
  ====================================================== */
  const uploadPDF = async (file) => {
    if (!file || file.type !== "application/pdf") {
      return alert("Only PDF files allowed");
    }

    const fileUrl = await uploadFileToCloudinary(file);

    await addDoc(collection(db, "courses", courseId, "materials"), {
      name: file.name,
      fileUrl,
      published: true,
      createdAt: serverTimestamp(),
    });

    reloadAll();
  };

  const toggleMaterial = async (id, published) => {
    await updateDoc(
      doc(db, "courses", courseId, "materials", id),
      { published: !published }
    );
    reloadAll();
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm("Delete this PDF?")) return;
    await deleteDoc(doc(db, "courses", courseId, "materials", id));
    reloadAll();
  };

  /* ======================================================
     ASSIGNMENTS
  ====================================================== */
  const createAssignment = async () => {
    if (!assignmentForm.title.trim())
      return alert("Assignment title required");

    await addDoc(collection(db, "courses", courseId, "assignments"), {
      ...assignmentForm,
      published: false,
      createdAt: serverTimestamp(),
    });

    setAssignmentForm({ title: "", description: "", dueDate: "" });
    reloadAll();
  };

  const toggleAssignment = async (id, published) => {
    await updateDoc(
      doc(db, "courses", courseId, "assignments", id),
      { published: !published }
    );
    reloadAll();
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Delete assignment?")) return;
    await deleteDoc(doc(db, "courses", courseId, "assignments", id));
    reloadAll();
  };

  /* ======================================================
     RENDER
  ====================================================== */
  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-white border-r p-6 space-y-6">
        <h2 className="text-lg font-bold">Instructor Studio</h2>

        <div>
          <p className="text-sm text-gray-500">Course</p>
          <p className="font-medium">{course.title}</p>
          <span className="text-xs px-2 py-1 rounded bg-gray-200">
            {course.status}
          </span>
        </div>

        <button
          onClick={toggleCourseStatus}
          className={`w-full py-2 rounded text-white ${
            course.status === "published"
              ? "bg-red-500"
              : "bg-indigo-600"
          }`}
        >
          {course.status === "published"
            ? "Unpublish Course"
            : "Publish Course"}
        </button>

        <nav className="space-y-2 pt-4">
          <TabButton tab="lessons" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton tab="materials" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton tab="assignments" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* ---------- LESSONS ---------- */}
        {activeTab === "lessons" && (
          <Section title="Lessons & Videos">
            <EditorInput
              label="Lesson Title"
              value={lessonForm.title}
              onChange={v => setLessonForm(p => ({ ...p, title: v }))}
            />
            <EditorTextarea
              label="Lesson Description"
              value={lessonForm.description}
              onChange={v => setLessonForm(p => ({ ...p, description: v }))}
            />
            <PrimaryButton onClick={createLesson}>Add Lesson</PrimaryButton>

            <Divider />

            {lessons.map(l => (
              <LessonCard
                key={l.id}
                lesson={l}
                uploading={uploadingLessonId === l.id}
                onVideoUpload={uploadLessonVideo}
                onUpdate={updateLesson}
                onDelete={deleteLesson}
              />
            ))}
          </Section>
        )}

        {/* ---------- MATERIALS ---------- */}
        {activeTab === "materials" && (
          <Section title="PDF Resources">
            <input
              type="file"
              accept="application/pdf"
              onChange={e => uploadPDF(e.target.files[0])}
            />

            <Divider />

            {materials.map(m => (
              <Row key={m.id}>
                <span>📄 {m.name}</span>
                <div className="flex gap-2">
                  <SecondaryButton onClick={() => toggleMaterial(m.id, m.published)}>
                    {m.published ? "Unpublish" : "Publish"}
                  </SecondaryButton>
                  <DangerButton onClick={() => deleteMaterial(m.id)}>
                    Delete
                  </DangerButton>
                </div>
              </Row>
            ))}
          </Section>
        )}

        {/* ---------- ASSIGNMENTS ---------- */}
        {activeTab === "assignments" && (
          <Section title="Assignments">
            <EditorInput
              label="Title"
              value={assignmentForm.title}
              onChange={v => setAssignmentForm(p => ({ ...p, title: v }))}
            />
            <EditorTextarea
              label="Description"
              value={assignmentForm.description}
              onChange={v => setAssignmentForm(p => ({ ...p, description: v }))}
            />
            <EditorInput
              label="Due Date"
              type="date"
              value={assignmentForm.dueDate}
              onChange={v => setAssignmentForm(p => ({ ...p, dueDate: v }))}
            />
            <PrimaryButton onClick={createAssignment}>
              Add Assignment
            </PrimaryButton>

            <Divider />

            {assignments.map(a => (
              <Row key={a.id}>
                <span>📝 {a.title}</span>
                <div className="flex gap-2">
                  <SecondaryButton onClick={() => toggleAssignment(a.id, a.published)}>
                    {a.published ? "Unpublish" : "Publish"}
                  </SecondaryButton>
                  <DangerButton onClick={() => deleteAssignment(a.id)}>
                    Delete
                  </DangerButton>
                </div>
              </Row>
            ))}
          </Section>
        )}

      </main>
    </div>
  );
}

/* ======================================================
   SMALL UI COMPONENTS
====================================================== */

function TabButton({ tab, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full text-left px-3 py-2 rounded ${
        activeTab === tab
          ? "bg-indigo-600 text-white"
          : "hover:bg-gray-100"
      }`}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="my-6" />;
}

function Row({ children }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded mb-2">
      {children}
    </div>
  );
}

function LessonCard({ lesson, uploading, onVideoUpload, onUpdate, onDelete }) {
  return (
    <div className="border rounded p-4 space-y-2">
      <input
        className="font-medium w-full"
        defaultValue={lesson.title}
        onBlur={e => onUpdate(lesson.id, "title", e.target.value)}
      />
      <textarea
        className="w-full text-sm text-gray-600"
        defaultValue={lesson.description}
        onBlur={e => onUpdate(lesson.id, "description", e.target.value)}
      />

      <div className="flex gap-2">
        <label className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer">
          Upload / Replace Video
          <input
            hidden
            type="file"
            accept="video/*"
            onChange={e => onVideoUpload(lesson.id, e.target.files[0])}
          />
        </label>

        <button
          onClick={() => onDelete(lesson.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

        {uploading && <span className="text-xs">Uploading…</span>}
      </div>
    </div>
  );
}

function EditorInput({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        className="w-full border p-2 rounded"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function EditorTextarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        className="w-full border p-2 rounded"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

const PrimaryButton = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-indigo-600 text-white px-4 py-2 rounded">
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick }) => (
  <button onClick={onClick} className="border px-3 py-1 rounded">
    {children}
  </button>
);

const DangerButton = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-red-500 text-white px-3 py-1 rounded">
    {children}
  </button>
);
