import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/PublicHome";
import Courses from "../pages/Courses";
import ProtectedRoute from "./ProtectedRoute"; 
import NotFound from "../pages/NotFound";
import AdminPanel from "../pages/AdminPanel";

export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AnimatePresence>
  );
}
