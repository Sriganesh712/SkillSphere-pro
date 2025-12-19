import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export default function LearnerAssignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      // 🔐 Check enrollment
      const enrollSnap = await getDoc(
        doc(db, "enrollments", `${courseId}_${user.uid}`)
      );
      if (!enrollSnap.exists() || enrollSnap.data().status !== "approved") {
        return navigate("/dashboard");
      }

      // 📝 Load assignments
      const assignSnap = await getDocs(
        collection(db, "courses", courseId, "assignments")
      );

      const data = [];

      for (const a of assignSnap.docs) {
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

        data.push({
          id: a.id,
          ...a.data(),
          submission: subSnap.exists() ? subSnap.data() : null,
        });
      }

      setAssignments(data);
      setLoading(false);
    };

    load();
  }, [courseId, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Assignments & Feedback
      </h1>

      {assignments.length === 0 && (
        <p className="text-gray-500">
          No assignments available.
        </p>
      )}

      {assignments.map((a) => (
        <div
          key={a.id}
          className="bg-white p-6 rounded-xl shadow border space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold">
              📝 {a.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {a.description}
            </p>
          </div>

          {!a.submission && (
            <p className="text-yellow-600 font-medium">
              ⏳ Not submitted yet
            </p>
          )}

          {a.submission && (
            <>
              {/* SUBMISSION INFO */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  📎 Submitted file:{" "}
                  <a
                    href={a.submission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 underline"
                  >
                    {a.submission.fileName}
                  </a>
                </p>

                <p>
                  🕒 Submitted on:{" "}
                  {a.submission.submittedAt?.toDate().toLocaleString()}
                </p>
              </div>

              {/* FEEDBACK */}
              {a.submission.marks !== undefined ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <p className="font-semibold text-green-700">
                    ✅ Graded
                  </p>

                  <p className="mt-1">
                    <strong>Marks:</strong> {a.submission.marks}
                  </p>

                  {a.submission.feedback && (
                    <p className="mt-1">
                      <strong>Feedback:</strong>{" "}
                      {a.submission.feedback}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    Graded on{" "}
                    {a.submission.gradedAt?.toDate().toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-indigo-600 font-medium">
                  ⏳ Awaiting educator review
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
