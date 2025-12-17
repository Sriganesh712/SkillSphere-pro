import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../components/Loader";

export default function DashboardRedirect() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const resolveRedirect = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // ❌ No profile at all → must complete
      if (!snap.exists()) {
        setTarget("/complete-profile");
        return;
      }

      const data = snap.data();

      // ❌ Profile incomplete → must complete
      if (!data.role || !data.username || !data.dob) {
        setTarget("/complete-profile");
        return;
      }

      // ✅ Profile complete → go to role dashboard
      if (data.role === "educator") {
        setTarget("/educator/dashboard");
      } else {
        setTarget("/learner/dashboard");
      }
    };

    resolveRedirect();
  }, []);

  if (!target) return <Loader />;

  return <Navigate to={target} replace />;
}
