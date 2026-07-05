import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">SkillSphere Pro</h3>
          <p className="text-sm text-gray-400 mb-4">
            Empowering learners, educators, and organizations with skill-based learning
            for the future.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Facebook size={18} /></a>
            <a href="#" className="hover:text-white"><Twitter size={18} /></a>
            <a href="#" className="hover:text-white"><Instagram size={18} /></a>
            <a href="#" className="hover:text-white"><Linkedin size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Product</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="#testimonials" className="hover:text-white">Testimonials</a></li>
            <li><a href="#integrations" className="hover:text-white">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Company</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#about" className="hover:text-white">About Us</a></li>
            <li><a href="/#careers" className="hover:text-white">Careers</a></li>
            <li><a href="/#contact" className="hover:text-white">Contact</a></li>
            <li><a href="/#blog" className="hover:text-white">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Support</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/#help" className="hover:text-white">Help Center</a></li>
            <li><a href="/#terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/#privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/#status" className="hover:text-white">Status</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} SkillSphere Pro. All rights reserved.
      </div>
    </footer>
  );
}
