import React from "react";
import aboutImg from "../assets/Mehra.jpg"; // or .png, .webp

export default function AboutSection() {
  return (
    <section id="about" className="bg-gradient-to-b from-white via-blue-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            About <span className="text-blue-600">SkillSphere Pro</span>
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            SkillSphere Pro is a next-gen skill development platform designed to
            empower learners, educators, and organizations through cutting-edge
            tools and personalized learning paths.
          </p>
          <p className="text-md text-gray-600">
            Whether you're an individual looking to grow, a student preparing
            for the future, or an enterprise upskilling your team — SkillSphere
            Pro adapts to your goals and elevates your journey.
          </p>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <img
            src={aboutImg}
            alt="About SkillSphere Pro"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
