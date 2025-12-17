import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { isUsernameAvailable } from "../utils/username";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [educatorType, setEducatorType] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    const init = async () => {
        const user = auth.currentUser;

        if (!user) {
        navigate("/login", { replace: true });
        return;
        }

        const snap = await getDoc(doc(db, "users", user.uid));

        if (
        snap.exists() &&
        snap.data().role &&
        snap.data().username &&
        snap.data().dob
        ) {
        navigate("/dashboard", { replace: true });
        return;
        }

        if (snap.exists()) {
        const data = snap.data();
        setRole(data.role || "");
        setUsername(data.username || "");
        setDob(data.dob || "");
        setEducatorType(data.educatorType || "");
        setOrganization(data.organization || "");
        }

        setLoading(false);
    };

    init();
    }, [navigate]);


  const handleSave = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const cleanUsername = username.trim().toLowerCase();

    // 🔒 1️⃣ Check username availability
    const available = await isUsernameAvailable(cleanUsername);
    if (!available) {
        alert("Username already taken. Please choose another.");
        return;
    }

    // 🧾 2️⃣ Save profile
    await setDoc(
        doc(db, "users", user.uid),
        {
        role,
        username: cleanUsername,
        dob,
        educatorType: role === "educator" ? educatorType : null,
        organization: role === "educator" ? organization : null,
        createdAt: serverTimestamp(),
        },
        { merge: true }
    );

    // 🔑 3️⃣ Reserve username
    await setDoc(doc(db, "usernames", cleanUsername), {
        uid: user.uid,
    });

    navigate("/dashboard");
    };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex w-full overflow-hidden"
    >
      {/* Left Illustration */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-100 to-yellow-100 items-center justify-center">
        <img
          src={illustration}
          alt="Complete Profile"
          className="w-2/3 max-w-md"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Complete your profile
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Just one more step to get started
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("learner")}
              className={`flex-1 border rounded-md py-2 transition ${
                role === "learner"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              🎓 Learner
            </button>

            <button
              type="button"
              onClick={() => setRole("educator")}
              className={`flex-1 border rounded-md py-2 transition ${
                role === "educator"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
            >
              🧑‍🏫 Educator
            </button>
          </div>

          {/* Username */}
          <input
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* DOB */}
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          {/* Educator Fields */}
          {role === "educator" && (
            <>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={educatorType}
                onChange={(e) => setEducatorType(e.target.value)}
                required
              >
                <option value="">Educator Type</option>
                <option value="institution">Institution</option>
                <option value="college">College</option>
                <option value="self">Self Trainer</option>
              </select>

              <input
                placeholder="Organization / College (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </motion.div>
  );
}
