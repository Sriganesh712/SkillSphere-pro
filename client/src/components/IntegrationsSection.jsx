// components/IntegrationsSection.jsx
import React from "react";

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="py-20 px-6 md:px-16 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
        Seamless <span className="text-indigo-600">Integrations</span>
      </h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        SkillSphere Pro works with your favorite tools—Zoom, Google Meet, Slack, and more.
        Automate workflows, sync data, and streamline your learning ecosystem.
      </p>

      {/* You can later add logos here */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
        <img src="https://img.icons8.com/color/48/zoom.png" alt="Zoom" />
        <img src="https://img.icons8.com/color/48/google-meet--v1.png" alt="Google Meet" />
        <img src="https://img.icons8.com/color/48/slack-new.png" alt="Slack" />
        <img src="https://img.icons8.com/color/48/microsoft-teams.png" alt="Teams" />
        <img src="https://img.icons8.com/color/48/google-calendar.png" alt="Google Calendar" />
      </div>
    </section>
  );
}
