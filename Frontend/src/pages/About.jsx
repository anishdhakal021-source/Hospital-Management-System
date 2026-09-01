import {
  FaShieldAlt,
  FaStethoscope,
  FaUserFriends,
  FaClipboardList,
  FaCheckCircle,
  FaBuilding,
  FaHospital,
  FaDatabase,
  FaCalendarCheck,
  FaFileMedical,
  FaClock,
} from "react-icons/fa";

const About = () => {
  const portalRoles = [
    {
      id: "Admin",
      title: "Admin Portal",
      icon: FaShieldAlt,
      color: "bg-blue-600 text-white",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      description:
        "Provides executive oversight to manage departments, medical personnel accounts, schedules, and operational analytics.",
      capabilities: [
        "Manage departments & medical services",
        "Doctor & receptionist account controls",
        "System audit trails & analytics",
      ],
    },
    {
      id: "Doctor",
      title: "Doctor Portal",
      icon: FaStethoscope,
      color: "bg-teal-600 text-white",
      badge: "bg-teal-100 text-teal-700 border-teal-200",
      description:
        "Equips clinicians with tools to manage patient queues, review EMR records, and document diagnoses and prescriptions.",
      capabilities: [
        "Daily consultation schedule & queue",
        "Electronic Medical Record (EMR) access",
        "Digital diagnostics & prescriptions",
      ],
    },
    {
      id: "Patient",
      title: "Patient Portal",
      icon: FaUserFriends,
      color: "bg-cyan-600 text-white",
      badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
      description:
        "Empowers patients to manage their healthcare journey, from booking appointments to viewing records and reports.",
      capabilities: [
        "Account & profile management",
        "Doctor search & appointment booking",
        "View prescriptions & lab reports",
      ],
    },
    {
      id: "Reception",
      title: "Receptionist Portal",
      icon: FaClipboardList,
      color: "bg-indigo-600 text-white",
      badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
      description:
        "Streamlines front-desk patient intake, queue dispatch, and comprehensive billing and payment management.",
      capabilities: [
        "Walk-in registration & verification",
        "Check-in & queue dispatch",
        "Billing, invoices & receipts",
      ],
    },
  ];

  const systemBenefits = [
    {
      title: "Centralized Data Management",
      desc: "Unifies patient records, appointments, and billing in one central database.",
      icon: FaDatabase,
    },
    {
      title: "Role-Based Access Control",
      desc: "Enforces strict permissions so users only access features for their role.",
      icon: FaShieldAlt,
    },
    {
      title: "Automated Appointments",
      desc: "Prevents double-booking and optimizes slots across departments.",
      icon: FaCalendarCheck,
    },
    {
      title: "Patient EMR Management",
      desc: "Provides instant chronological records for authorized medical staff.",
      icon: FaFileMedical,
    },
    {
      title: "Doctor Schedule Control",
      desc: "Manages consultation hours, leave slots, and clinic availability.",
      icon: FaClock,
    },
  ];

  const statistics = [
    { label: "Role-Based Portals", value: "4 Unified" },
    { label: "Operational Efficiency", value: "+45%" },
    { label: "Data Accuracy", value: "99.9%" },
    { label: "Paperwork Friction", value: "Zero" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
            <FaHospital className="w-4 h-4" />
            <span>Centralized Hospital Operating System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About AasPaj Health Care
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            A centralized digital ecosystem that connects administrators,
            doctors, patients, and receptionists through a single secure
            database with role-based access.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {statistics.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-blue-100 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <FaBuilding className="w-3.5 h-3.5" />
                <span>Unified Platform Overview</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Connecting Healthcare Roles into One{" "}
                <span className="text-blue-600">
                  Centralized Digital Ecosystem
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                AasPaj Health Care addresses the operational bottlenecks of
                paper-based hospital workflows. By bridging administrators,
                doctors, patients, and receptionists through a single database,
                the system ensures real-time record synchronization, quick
                queue management, and transparent front-desk billing.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Built on modern web technologies, AasPaj Health Care
                standardizes communication across clinical consultations,
                appointment booking, patient intake, and payment invoicing
                under role-based security guards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                    <FaCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Role-Based Segregation
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Custom portals for each user role.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                    <FaClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Reception Billing & Queue
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Streamlined intake and invoice handling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-blue-500/50">
                <FaHospital className="w-8 h-8" />
                <span className="font-semibold">AasPaj Health Care</span>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                From auth to billing, every action updates the central database
                in real time, maintaining strict audit logs, transactional
                integrity, and cross-department synchronization.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <FaDatabase className="w-3.5 h-3.5" />
                <span>Connected to Central Encrypted Database</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              Tailored User Portals
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              One System, Four Powerful Portals
            </h2>
            <p className="text-gray-600 mt-3">
              Each portal is engineered for its target role, governed by
              role-based access control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalRoles.map((portal) => {
              const IconComp = portal.icon;
              return (
                <div
                  key={portal.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${portal.color} flex items-center justify-center`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${portal.badge}`}
                      >
                        {portal.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mt-2 mb-4">
                      {portal.description}
                    </p>
                    <ul className="space-y-2 border-t border-gray-100 pt-4">
                      {portal.capabilities.map((cap, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-700"
                        >
                          <FaCheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              Core Operational Advantages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Key System Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {systemBenefits.map((benefit, idx) => {
              const BenIcon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                    <BenIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Powered by a Centralized Database
          </h3>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            All four portals—Admin, Doctor, Patient, and Receptionist—interact
            seamlessly with a central database while Role-Based Access Control
            enforces strict data isolation.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition"
          >
            Back to Home
          </a>
        </div>
      </section>

    </div>
  );
};

export default About;
