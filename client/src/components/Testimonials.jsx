// TestimonialSection.jsx
import React from "react";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Full Stack Developer",
    text: "SkillSphere Pro revolutionized my learning experience. The curated content and seamless UI are just brilliant!",
    image: "/testimonials/aarav.webp",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer",
    text: "The design and interactivity of the platform feel truly premium. It’s like learning on an Apple site!",
    image: "/testimonials/priya.webp",
  },
  {
    name: "Varun Kapoor",
    role: "AI Researcher",
    text: "Integrating AI into the platform really sets it apart. Every feature feels thoughtfully crafted.",
    image: "/testimonials/varun.avif",
  },
];

export default function TestimonialSection() {
  return (
    <section id= "testimonials" className="py-20 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mx-auto -mt-16 mb-4"
              />
              <h3 className="text-xl font-semibold text-center">{t.name}</h3>
              <p className="text-sm text-center text-gray-500">{t.role}</p>
              <p className="mt-4 text-center text-gray-600 italic">
                “{t.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
