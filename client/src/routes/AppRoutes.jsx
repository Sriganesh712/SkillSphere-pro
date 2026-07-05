import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import DashboardRedirect from "../pages/dashboard/DashboardRedirect";
import NotFound from "../pages/NotFound";
import AssignmentSubmissions from "../pages/educator/AssignmentSubmissions";
import LearnerDashboard from "../pages/dashboard/LearnerDashboard";
import EducatorDashboard from "../pages/dashboard/EducatorDashboard";
import CoursePage from "../pages/learner/CoursePage";
import CompleteProfile from "../pages/CompleteProfile";
import CreateCourse from "../pages/educator/CreateCourse";
import MyCourses from "../pages/educator/MyCourses";
import CourseManage from "../pages/educator/CourseManage";
import EnrollmentRequests from "../pages/educator/EnrollmentRequests";
import LearnerAssignments from "../pages/learner/LearnerAssignments";
import CourseWatch from "../pages/learner/CourseWatch";
import BrowseCourses from "../pages/learner/BrowseCourses";
import MyEnrollments from "../pages/learner/MyEnrollments";
import Notifications from "../pages/learner/Notifications";

import Profile from "../pages/profile/profile";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

export default function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 🔐 Logged-in users only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= LEARNER ROUTES ================= */}
        <Route
          path="/learner/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["learner"]}>
              <LearnerDashboard />
            </RoleProtectedRoute>
          }
        />
            <Route
              path="/educator/course/:courseId/assignments"
              element={<AssignmentSubmissions />}
            />
            <Route
              path="/course/:courseId/assignments"
              element={<LearnerAssignments />}
            />

        <Route
          path="/courses"
          element={
            <RoleProtectedRoute allowedRoles={["learner"]}>
              <BrowseCourses />
            </RoleProtectedRoute>
          }
        />
        {/* COURSE PREVIEW PAGE */}
          <Route
            path="/course/:courseId"
            element={
              <RoleProtectedRoute allowedRoles={["learner"]}>
                <CoursePage />
              </RoleProtectedRoute>
            }
          />

          {/* COURSE LEARNING PAGE */}
          <Route
            path="/course/:courseId/watch"
            element={
              <RoleProtectedRoute allowedRoles={["learner"]}>
                <CourseWatch />
              </RoleProtectedRoute>
            }
          />

        <Route
          path="/my-enrollments"
          element={
            <RoleProtectedRoute allowedRoles={["learner"]}>
              <MyEnrollments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <RoleProtectedRoute allowedRoles={["learner"]}>
              <Notifications />
            </RoleProtectedRoute>
          }
        />

        {/* ================= EDUCATOR ROUTES ================= */}
        <Route
          path="/educator/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["educator"]}>
              <EducatorDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/educator/create-course"
          element={
            <RoleProtectedRoute allowedRoles={["educator"]}>
              <CreateCourse />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/educator/my-courses"
          element={
            <RoleProtectedRoute allowedRoles={["educator"]}>
              <MyCourses />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/educator/course/:courseId"
          element={
            <RoleProtectedRoute allowedRoles={["educator"]}>
              <CourseManage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/educator/requests"
          element={
            <RoleProtectedRoute allowedRoles={["educator"]}>
              <EnrollmentRequests />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
