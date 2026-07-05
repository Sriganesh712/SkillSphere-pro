import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Mail,
  School,
  Briefcase,
  BookOpen,
  X,
  UserCircle,
} from "lucide-react";

export default function EducatorModal({ totalCourses,educatorId, onClose }) {
  const [educator, setEducator] = useState(null);

  useEffect(() => {
    async function loadEducator() {
      const snap = await getDoc(doc(db, "users", educatorId));
      if (snap.exists()) {
        setEducator(snap.data());
      }
    }
    loadEducator();
  }, [educatorId]);

  if (!educator) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            {educator.profileImage ? (
              <img
                src={educator.profileImage}
                alt="Educator"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-white/80" />
            )}

            <div>
              <h2 className="text-2xl font-bold">{educator.fullName}</h2>
              <p className="text-sm text-white/90">
                {educator.institution || "Independent Educator"}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-gray-700">

          <div className="flex items-center gap-3">
            <Mail className="text-indigo-600" size={18} />
            <span className="text-sm">{educator.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="text-indigo-600" size={18} />
            <span className="text-sm">
              {educator.experience || "Experience not specified"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={18} />
            <span className="text-sm">
              {totalCourses} published courses
            </span>
          </div>

          {educator.bio && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                About the educator
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {educator.bio}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
