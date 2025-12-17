import { useNavigate } from "react-router-dom";

export default function LearnerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome 👋
      </h1>
      <p className="text-gray-600 mb-8">
        What would you like to do today?
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* My Learning */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">My Learning</h2>
          <p className="text-gray-600 mb-4">
            View courses you are enrolled in and track progress.
          </p>
          <button
            onClick={() => navigate("/learner/courses")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Go to My Learning →
          </button>
        </div>

        {/* Browse Courses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Browse Courses</h2>
          <p className="text-gray-600 mb-4">
            Explore new courses from educators.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Browse Courses →
          </button>
        </div>

        {/* Requests */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Enrollment Requests</h2>
          <p className="text-gray-600 mb-4">
            Track approval status of your enrollment requests.
          </p>
          <button
            onClick={() => navigate("/learner/requests")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View Requests →
          </button>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">My Profile</h2>
          <p className="text-gray-600 mb-4">
            View and update your profile information.
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
