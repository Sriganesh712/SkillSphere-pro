import { Routes, Route, Navigate } from "react-router-dom";
import DashboardRedirect from "../pages/dashboard/DashboardRedirect";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";
import LearnerDashboard from "../pages/dashboard/LearnerDashboard";
import EducatorDashboard from "../pages/dashboard/EducatorDashboard";
import CompleteProfile from "../pages/CompleteProfile";
import CreateCourse from "../pages/educator/CreateCourse";
import MyCourses from "../pages/educator/MyCourses";
import CourseManage from "../pages/educator/CourseManage";
import CourseWatch from "../pages/learner/CourseWatch";
import BrowseCourses from "../pages/learner/BrowseCourses";
import EnrollmentRequests from "../pages/educator/EnrollmentRequests";
import MyEnrollments from "../pages/learner/MyEnrollments";

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
        <Route path="/educator/dashboard" element={<EducatorDashboard />} />
        <Route path="/educator/create-course" element={<CreateCourse />} />
        <Route path="/educator/my-courses" element={<MyCourses />} />
        <Route path="/educator/course/:courseId" element={<CourseManage />} />
        <Route path="/course/:courseId" element={<CourseWatch />} />
        <Route path="/courses" element={<BrowseCourses />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/educator/requests"element={<EnrollmentRequests />}/>
      </Routes>
    </>
  );
}
