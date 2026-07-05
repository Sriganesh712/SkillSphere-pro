import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const user = auth.currentUser;
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const role = snap.data().role;
        setAuthorized(allowedRoles.includes(role));
      } else {
        setAuthorized(false);
      }

      setLoading(false);
    }

    checkRole();
  }, [allowedRoles]);

  if (loading) return null; // or <Loader />

  return authorized ? children : <Navigate to="/dashboard" replace />;
}
