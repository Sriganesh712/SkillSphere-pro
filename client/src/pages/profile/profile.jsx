import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Loader from "../../components/Loader";

import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import LearnerProfile from "./LearnerProfile";
import EducatorProfile from "./EducatorProfile";
import ActivityFeed from "./ActivityFeed";
import ProfileSettings from "./ProfileSettings";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // 🔹 1️⃣ Load profile (runs once)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (!snap.exists()) {
          navigate("/complete-profile");
          return;
        }

        setUserData({ uid: user.uid, ...snap.data() });
        setLoading(false);
      },
      (error) => {
        console.error("Profile snapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [navigate]);

  // 🔹 2️⃣ React to userData changes (THIS is the key)
  useEffect(() => {
    if (!userData) return;

    console.log("ROLE DEBUG:", {
      role: userData.role,
      isLearner: userData.role === "learner",
      isEducator: userData.role === "educator",
    });
  }, [userData]);

  if (loading || !userData) return <Loader />;

  const isLearner = userData.role === "learner";
  const isEducator = userData.role === "educator";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <ProfileHeader user={userData} />
      <ProfileAbout user={userData} />
      {isLearner && <LearnerProfile user={userData} />}
      {isEducator && <EducatorProfile user={userData} />}
      <ActivityFeed user={userData} />
      <ProfileSettings user={userData} />
    </div>
  );
}
