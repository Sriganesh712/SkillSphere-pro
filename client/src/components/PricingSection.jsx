// PricingSection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@headlessui/react";
import { CheckCircle2, Star, CreditCard } from "lucide-react";

const categories = ["Students", "Educators", "Corporates"];

const plans = {
  Students: [
    {
      name: "Basic",
      price: { monthly: 0, yearly: 0 },
      features: ["Access to basic tutorials", "Community support"],
    },
    {
      name: "Pro",
      price: { monthly: 5, yearly: 50 },
      features: ["Project templates", "Certificate of completion"],
      badge: "Most Popular",
    },
    {
      name: "Ultimate",
      price: { monthly: 10, yearly: 100 },
      features: ["1-on-1 mentorship", "Internship support"],
    },
  ],
  Educators: [
    {
      name: "Starter",
      price: { monthly: 5, yearly: 50 },
      features: ["Create courses", "Manage students"],
    },
    {
      name: "Advanced",
      price: { monthly: 15, yearly: 150 },
      features: ["Detailed analytics", "Marketing tools"],
      badge: "Best Value",
    },
    {
      name: "Enterprise",
      price: { monthly: 25, yearly: 250 },
      features: ["Team collaboration", "White-labeled platform"],
    },
  ],
  Corporates: [
    {
      name: "Team",
      price: { monthly: 30, yearly: 300 },
      features: ["Upto 25 seats", "Progress tracking"],
    },
    {
      name: "Growth",
      price: { monthly: 50, yearly: 500 },
      features: ["Dedicated support", "Custom content"],
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: { monthly: 100, yearly: 1000 },
      features: ["Unlimited users", "API access"],
    },
  ],
};

export default function PricingSection() {
  const [category, setCategory] = useState("Students");
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Flexible Pricing for Everyone</h2>
        <p className="text-lg text-gray-600">Choose the plan that fits your role and scale.</p>
      </div>

      <div className="flex justify-center mb-6 flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full border transition font-medium text-sm ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mb-12">
        <span className="text-sm">Monthly</span>
        <Switch
          checked={isYearly}
          onChange={setIsYearly}
          className={`$${
            isYearly ? "bg-indigo-600" : "bg-gray-300"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
        >
          <span
            className={`$${
              isYearly ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span className="text-sm">Yearly</span>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {plans[category].map((plan) => (
            <motion.div
              key={plan.name}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => handlePlanClick(plan)}
                className={`relative border rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer ${
                  selectedPlan?.name === plan.name
                    ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300"
                    : "bg-white border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full shadow">
                    <Star size={14} className="inline-block mr-1" />
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <motion.p
                  key={isYearly ? plan.price.yearly : plan.price.monthly}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold mb-4"
                >
                  ₹{isYearly ? plan.price.yearly : plan.price.monthly}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    /{isYearly ? "year" : "mo"}
                  </span>
                </motion.p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => alert(`Proceeding to payment for ${plan.name} - ₹${isYearly ? plan.price.yearly : plan.price.monthly}/${isYearly ? "year" : "mo"}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition"
                >
                  <CreditCard size={16} /> Subscribe
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
