import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", image: "" });

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, "courses"));
    setCourses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async () => {
    await addDoc(collection(db, "courses"), newCourse);
    setNewCourse({ title: "", description: "", image: "" });
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    fetchCourses();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Add Course Form */}
      <div className="bg-gray-100 p-6 rounded-xl mb-8">
        <input
          type="text"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCourse.image}
          onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <button onClick={addCourse} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Course
        </button>
      </div>

      {/* List Courses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="p-4 border rounded-xl shadow-sm bg-white">
            <img src={c.image} alt={c.title} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.description}</p>
            <button
              onClick={() => deleteCourse(c.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
