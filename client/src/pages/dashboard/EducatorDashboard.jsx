import { useNavigate } from "react-router-dom";

export default function EducatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, Educator 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Manage your courses and learners from here.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          <p className="text-gray-600 mb-4">
            View and manage the courses you have created.
          </p>
          <button
            onClick={() => navigate("/educator/my-courses")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View My Courses →
          </button>
        </div>

        {/* Create Course */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Create New Course</h2>
          <p className="text-gray-600 mb-4">
            Publish a new course and upload learning content.
          </p>
          <button
            onClick={() => navigate("/educator/create-course")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Create Course →
          </button>
        </div>

        {/* Enrollment Requests */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Enrollment Requests</h2>
          <p className="text-gray-600 mb-4">
            Review learner requests and approve enrollments.
          </p>
          <button
            onClick={() => navigate("/educator/requests")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View Requests →
          </button>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">My Profile</h2>
          <p className="text-gray-600 mb-4">
            View and update your educator profile details.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View Profile →
          </button>
        </div>

      </div>
    </div>
  );
}
