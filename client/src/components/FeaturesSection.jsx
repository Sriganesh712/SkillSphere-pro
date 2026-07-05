import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Learning",
    description: "Get personalized course suggestions and real-time doubt solving with built-in AI tools.",
  },
  {
    title: "Live Class Support",
    description: "Attend live interactive classes and one-on-one mentor sessions anytime, anywhere.",
  },
  {
    title: "Skill Certification",
    description: "Earn credible certifications and build your resume directly from the platform.",
  },
  {
    title: "Course Marketplace",
    description: "Access courses from top educators or publish your own with ease.",
  },
  {
    title: "Smart Progress Tracking",
    description: "Track your learning milestones, deadlines, and goals visually.",
  },
  {
    title: "Community & Forums",
    description: "Join like-minded learners, ask questions, and grow together.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 py-20 px-6 md:px-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Why Choose <span className="text-indigo-600">SkillSphere Pro</span>?
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CheckCircle className="text-indigo-600 w-6 h-6" />
            <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
