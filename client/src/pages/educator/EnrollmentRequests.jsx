import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export default function EnrollmentRequests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "enrollments"),
        where("educatorId", "==", user.uid),
        where("status", "==", "pending")
      );

      const snap = await getDocs(q);
      setRequests(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    };

    loadRequests();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "enrollments", id), { status });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Enrollment Requests
      </h1>

      {requests.length === 0 && (
        <p className="text-gray-500">
          No pending enrollment requests.
        </p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{req.learnerName}</p>
              <p className="text-sm text-gray-500">
                Requested: {req.courseTitle}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(req.id, "approved")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(req.id, "rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
