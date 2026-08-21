const services = [
  {
    title: "General Consultation",
    description:
      "Get professional medical advice and regular health checkups from our experienced doctors.",
  },
  {
    title: "Cardiology",
    description:
      "Specialized heart care, diagnosis, and treatment from experienced cardiac specialists.",
  },
  {
    title: "Neurology",
    description:
      "Expert diagnosis and treatment for neurological conditions with patient-centered care.",
  },
  {
    title: "Orthopedics",
    description:
      "Complete care for bones, joints, muscles, and other orthopedic conditions.",
  },
  {
    title: "Laboratory Services",
    description:
      "Accurate diagnostic testing and reliable medical reports to support better treatment decisions.",
  },
  {
    title: "Emergency Care",
    description:
      "Fast and reliable emergency medical care available whenever you need immediate assistance.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wider">
              Our Healthcare Services
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Complete Care for Your Health
            </h2>

            <p className="text-gray-600 mt-4 max-w-xl">
              From routine checkups to specialized treatment, AasPaj
              HealthCare provides comprehensive medical services for you and
              your family.
            </p>
          </div>

          <button className="mt-6 md:mt-0 text-blue-600 font-semibold hover:text-blue-800 transition">
            View All Services →
          </button>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-6 mb-5">
                {service.description}
              </p>

              <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Learn More →
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;