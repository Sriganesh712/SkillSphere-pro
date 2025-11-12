import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition"
          aria-label="Go to SkillSphere home"
        >
          SkillSphere
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link to="/courses" className="hover:text-indigo-600 transition">
            Courses
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition">
            Contact
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            type="button"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="button"
          >
            <span className="material-symbols-outlined">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden px-6 pb-4 space-y-2 text-sm text-gray-700 transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="block hover:text-indigo-600 transition"
        >
          Home
        </Link>
        <Link
          to="/courses"
          onClick={() => setIsOpen(false)}
          className="block hover:text-indigo-600 transition"
        >
          Courses
        </Link>
        <Link
          to="/about"
          onClick={() => setIsOpen(false)}
          className="block hover:text-indigo-600 transition"
        >
          About
        </Link>
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="block hover:text-indigo-600 transition"
        >
          Contact
        </Link>
        <button
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
          className="block w-full text-left bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
