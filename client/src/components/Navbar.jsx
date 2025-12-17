import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      setRole(snap.exists() ? snap.data().role : "learner");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
          SkillSphere
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link to="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>

          {/* LEARNER */}
          {role === "learner" && (
            <>
              <Link to="/courses" className="hover:text-indigo-600">
                Courses
              </Link>
              <Link to="/my-enrollments" className="hover:text-indigo-600">
                My Enrollments
              </Link>
            </>
          )}

          {/* EDUCATOR */}
          {role === "educator" && (
            <>
              <Link to="/educator/my-courses" className="hover:text-indigo-600">
                My Courses
              </Link>
              <Link to="/educator/requests" className="hover:text-indigo-600">
                Requests
              </Link>
              <Link to="/educator/create-course" className="hover:text-indigo-600">
                Create Course
              </Link>
            </>
          )}

          <Link to="/profile" className="hover:text-indigo-600">
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
