import React from "react";

const departments = [
  {
    name: "Ophthalmology",
    icon: "👁️",
    description:
      "Specialized care for eye-related conditions, vision problems, and eye health.",
  },
  {
    name: "Neurology",
    icon: "🧠",
    description:
      "Diagnosis and treatment of conditions affecting the brain, nerves, and nervous system.",
  },
  {
    name: "Cardiology",
    icon: "❤️",
    description:
      "Specialized healthcare for heart and cardiovascular conditions.",
  },
  {
    name: "Orthopedics",
    icon: "🦴",
    description:
      "Treatment and management of problems related to bones, joints, and muscles.",
  },
  {
    name: "General Medicine",
    icon: "🩺",
    description:
      "Diagnosis and treatment of common illnesses and general health conditions.",
  },
  {
    name: "Pediatrics",
    icon: "👶",
    description:
      "Healthcare services focused on the health, growth, and development of children.",
  },
  {
    name: "Dermatology",
    icon: "🧴",
    description:
      "Diagnosis and treatment of conditions affecting the skin, hair, and nails.",
  },
  {
    name: "Dentistry",
    icon: "🦷",
    description:
      "Dental care including prevention, diagnosis, and treatment of oral conditions.",
  },
  {
    name: "Gynecology",
    icon: "👩‍⚕️",
    description:
      "Specialized healthcare services for women's reproductive health.",
  },
  {
    name: "Pulmonology",
    icon: "🫁",
    description:
      "Diagnosis and treatment of lung and respiratory-related conditions.",
  },
];

const Departments = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">

          <p className="text-blue-600 font-semibold mb-3">
            AasPaj LifeCare Hospital
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Our Departments
          </h1>

          <p className="mt-5 text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our specialized medical departments and find the right
            healthcare services for you and your family.
          </p>

        </div>
      </section>

      {/* Department Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {departments.map((department) => (
            <div
              key={department.name}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              {/* Icon */}
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-5">
                {department.icon}
              </div>

              {/* Department Name */}
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {department.name}
              </h2>

              {/* Description */}
              <p className="text-gray-600 leading-6 mb-6">
                {department.description}
              </p>

              {/* View Doctors */}
              <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                View Doctors →
              </button>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
};

export default Departments;