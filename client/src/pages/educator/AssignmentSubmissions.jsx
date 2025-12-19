import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
} from "firebase/firestore";
import Loader from "../../components/Loader";

export default function AssignmentSubmissions() {
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [grading, setGrading] = useState({});

  useEffect(() => {
    const load = async () => {
      const assignSnap = await getDocs(
        collection(db, "courses", courseId, "assignments")
      );

      const assignData = assignSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
      setAssignments(assignData);

      const subs = {};
      for (const a of assignData) {
        const subSnap = await getDocs(
          collection(
            db,
            "courses",
            courseId,
            "assignments",
            a.id,
            "submissions"
          )
        );

        subs[a.id] = subSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
      }

      setSubmissions(subs);
      setLoading(false);
    };

    load();
  }, [courseId]);

  const gradeSubmission = async (assignmentId, learnerId) => {
    const { marks, feedback } = grading[`${assignmentId}_${learnerId}`];

    await updateDoc(
      doc(
        db,
        "courses",
        courseId,
        "assignments",
        assignmentId,
        "submissions",
        learnerId
      ),
      {
        marks: Number(marks),
        feedback,
        gradedAt: new Date(),
      }
    );

    alert("Graded successfully ✅");
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">

      {assignments.map(a => (
        <div key={a.id} className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            📝 {a.title}
          </h2>

          {submissions[a.id]?.length === 0 && (
            <p className="text-gray-500">No submissions yet.</p>
          )}

          <div className="space-y-6">
            {submissions[a.id]?.map(s => (
              <div
                key={s.learnerId}
                className="border p-4 rounded space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Learner ID: {s.learnerId}
                  </p>

                  <a
                    href={s.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 text-sm underline"
                  >
                    Download
                  </a>
                </div>

                {/* GRADING */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Marks"
                    defaultValue={s.marks || ""}
                    className="border p-2 rounded"
                    onChange={(e) =>
                      setGrading(prev => ({
                        ...prev,
                        [`${a.id}_${s.learnerId}`]: {
                          ...prev[`${a.id}_${s.learnerId}`],
                          marks: e.target.value,
                        },
                      }))
                    }
                  />

                  <input
                    placeholder="Feedback"
                    defaultValue={s.feedback || ""}
                    className="border p-2 rounded col-span-2"
                    onChange={(e) =>
                      setGrading(prev => ({
                        ...prev,
                        [`${a.id}_${s.learnerId}`]: {
                          ...prev[`${a.id}_${s.learnerId}`],
                          feedback: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <button
                  onClick={() => gradeSubmission(a.id, s.learnerId)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
                >
                  Save Grade
                </button>

                {s.marks !== undefined && (
                  <p className="text-sm text-green-600">
                    ✔ Graded ({s.marks} marks)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
