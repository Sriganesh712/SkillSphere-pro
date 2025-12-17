import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import Loader from "../../components/Loader";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");

  const [educatorName, setEducatorName] = useState("");

  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      // ❌ Block non-educators
      if (!snap.exists() || snap.data().role !== "educator") {
        navigate("/dashboard");
        return;
      }

      setEducatorName(snap.data().fullName || "Educator");
      setLoading(false);
    };

    init();
  }, [navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "courses"), {
      title,
      description,
      category,
      level,
      educatorId: auth.currentUser.uid,
      educatorName,
      status: "draft",
      createdAt: serverTimestamp(),
    });

    navigate("/educator/my-courses");
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>

      <form onSubmit={handleCreate} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          placeholder="Course title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Course description"
          className="w-full border p-3 rounded h-32"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category (e.g. Web Development)"
          className="w-full border p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-500 transition"
        >
          Save Course (Draft)
        </button>
      </form>
    </div>
  );
}
