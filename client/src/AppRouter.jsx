import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import PublicRoutes from "./routes/PublicRoutes";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";

export default function AppRouter() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) return <Loader />;

  return user ? <AppRoutes /> : <PublicRoutes />;
}
