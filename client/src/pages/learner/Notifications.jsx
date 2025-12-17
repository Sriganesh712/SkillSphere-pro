import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { onSnapshot } from "firebase/firestore";

export default function Notifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) {
    navigate("/login");
    return;
  }

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snap) => {
    setNotifications(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
    setLoading(false);
  });

  return () => unsubscribe();
}, [navigate]);


  const openNotification = async (notif) => {
    // ✅ Mark as read
    if (!notif.read) {
      await updateDoc(doc(db, "notifications", notif.id), {
        read: true,
      });
    }

    // Update UI instantly
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, read: true } : n
      )
    );

    navigate(notif.link);
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "notifications", id));
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications yet.</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow flex justify-between items-start ${
              n.read ? "bg-white" : "bg-indigo-50"
            }`}
          >
            <div
              onClick={() => openNotification(n)}
              className="cursor-pointer"
            >
              <h2 className="font-medium">{n.title}</h2>
              <p className="text-sm text-gray-600">{n.message}</p>

              {!n.read && (
                <span className="text-xs text-indigo-600">
                  ● Unread
                </span>
              )}
            </div>

            {/* 🗑️ DELETE */}
            <button
              onClick={() => deleteNotification(n.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
