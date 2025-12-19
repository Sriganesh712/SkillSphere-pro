import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = null;
    let unsubscribeNotif = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Reset state when logged out
      if (!user) {
        setRole(null);
        setUnreadCount(0);
        setLoading(false);

        if (unsubscribeUser) unsubscribeUser();
        if (unsubscribeNotif) unsubscribeNotif();
        return;
      }

      // 🔹 USER ROLE (realtime)
      unsubscribeUser = onSnapshot(
        doc(db, "users", user.uid),
        (snap) => {
          if (snap.exists()) {
            setRole(snap.data().role);
          }
          setLoading(false);
        }
      );

      // 🔔 UNREAD NOTIFICATIONS (realtime)
      const notifQuery = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        where("read", "==", false)
      );

      unsubscribeNotif = onSnapshot(notifQuery, (snap) => {
        setUnreadCount(snap.size);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeNotif) unsubscribeNotif();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
          SkillSphere
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link to="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>

          {/* LEARNER LINKS */}
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

          {/* EDUCATOR LINKS */}
          {role === "educator" && (
            <>
              <Link
                to="/educator/my-courses"
                className="hover:text-indigo-600"
              >
                My Courses
              </Link>
              <Link
                to="/educator/requests"
                className="hover:text-indigo-600"
              >
                Requests
              </Link>
              <Link
                to="/educator/create-course"
                className="hover:text-indigo-600"
              >
                Create Course
              </Link>
            </>
          )}

          {/* PROFILE */}
          <Link to="/profile" className="hover:text-indigo-600">
            Profile
          </Link>

          {/* NOTIFICATIONS */}
          <Link to="/notifications" className="relative hover:text-indigo-600">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* LOGOUT */}
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
