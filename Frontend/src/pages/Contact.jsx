import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaChevronDown,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaShieldAlt,
  FaBuilding,
  FaStethoscope,
  FaHeart,
} from "react-icons/fa";

const HOSPITAL_CONFIG = {
  name: "AasPaj Health Care",
  address: "Kathmandu, Nepal",
  phone: "+977-98XXXXXXXX",
  email: "info@AasPaj.com",
  emergencyPhone: "+977-98XXXXXXXX",
  workingHours: {
    weekdays: "Sunday - Friday: 9:00 AM - 5:00 PM",
    weekend: "Saturday: Emergency Services Only",
  },
  coordinates: {
    lat: "27.7172",
    lng: "85.3240",
    city: "Kathmandu, Nepal",
  },
};

const FAQ_DATA = [
  {
    id: 1,
    question: "How can I book an appointment through the Patient Portal?",
    answer:
      "Registered patients can log into the Patient Portal, choose an available doctor schedule, and confirm their booking. An electronic appointment ticket will be generated automatically.",
    category: "Patient Portal",
  },
  {
    id: 2,
    question: "How can I get help with my patient account or login issues?",
    answer:
      "Please fill out the contact form selecting 'Technical & Portal Assistance' as the subject, or call our IT helpdesk during working hours.",
    category: "Account & Technical",
  },
  {
    id: 3,
    question: "How can I contact the reception desk or check doctor availability?",
    answer:
      "Our Reception Desk handles live doctor availability and queue check-ins. Reach out via our central phone line or visit the reception counter in Kathmandu.",
    category: "Reception",
  },
  {
    id: 4,
    question: "How can I receive assistance with medical reports and prescriptions?",
    answer:
      "Lab results and prescriptions are uploaded to your Patient Portal by attending doctors once validated. For hardcopy requests, contact our Medical Records desk.",
    category: "Reports & Diagnostics",
  },
  {
    id: 5,
    question: "Who should I contact for system access support (Doctors & Staff)?",
    answer:
      "Hospital employees requiring role permission updates or reporting portal bugs can submit an internal IT ticket via 'Technical & Portal Assistance'.",
    category: "Staff & Admin",
  },
];

const REASONS_DATA = [
  {
    icon: FaCalendarAlt,
    title: "Appointment Assistance",
    desc: "Help with OPD doctor slots and appointment ticket cancellation.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: FaUser,
    title: "Patient Registration Support",
    desc: "Guidance on creating your patient account or updating records.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: FaShieldAlt,
    title: "Technical & Portal Support",
    desc: "Resolution for login errors, resets, and portal navigation.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: FaFileAlt,
    title: "Medical Reports & History",
    desc: "Inquiries regarding lab releases and digital prescription access.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: FaBuilding,
    title: "Reception & Queue Help",
    desc: "Support for walk-in check-ins and clinic room locations.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: FaQuestionCircle,
    title: "General Inquiries",
    desc: "Information about visiting hours and billing desks.",
    color: "bg-purple-50 text-purple-600",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Appointment Assistance",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(1);
  const [faqCategory, setFaqCategory] = useState("All");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Please type your message";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "Appointment Assistance",
        message: "",
      });
      setErrors({});
    }, 800);
  };

  const filteredFaqs =
    faqCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((faq) => faq.category === faqCategory);

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 bg-gray-50 border ${
      errors[field]
        ? "border-rose-400 focus:ring-rose-400"
        : "border-gray-200 focus:ring-blue-500"
    } rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition`;

  const infoCards = [
    {
      label: "Location",
      title: "Hospital Address",
      value: HOSPITAL_CONFIG.address,
      icon: FaMapMarkerAlt,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Helpline",
      title: "Phone Number",
      value: HOSPITAL_CONFIG.phone,
      icon: FaPhoneAlt,
      color: "bg-teal-50 text-teal-600",
    },
    {
      label: "Email Desk",
      title: "Email Address",
      value: HOSPITAL_CONFIG.email,
      icon: FaEnvelope,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Schedule",
      title: "Working Hours",
      value: HOSPITAL_CONFIG.workingHours.weekdays,
      icon: FaClock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium">
            <FaHeart className="w-4 h-4 text-blue-600" />
            <span>AasPaj Central Support Desk</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contact Us
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Have questions or need assistance? Our team is here to help you
            across all Patient, Doctor, Receptionist, and Admin services.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {infoCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {card.label}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{card.value}</p>
                {card.title === "Working Hours" && (
                  <p className="text-xs text-amber-700 font-semibold mt-1">
                    {HOSPITAL_CONFIG.workingHours.weekend}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Form + Why Contact Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left: Why Contact Us */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                System Assistance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Contact AasPaj Health Care?
              </h2>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Whether you are a patient managing appointments, a doctor
                accessing consultation logs, or a staff member needing
                technical support, our centralized desk is here for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {REASONS_DATA.map((reason, index) => {
                const IconComponent = reason.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition flex items-start space-x-3.5"
                  >
                    <div
                      className={`p-2.5 rounded-lg ${reason.color} flex-shrink-0`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {reason.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {reason.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-blue-600 text-white shadow-md space-y-3">
              <div className="flex items-center space-x-2 text-blue-100 text-xs font-semibold uppercase tracking-wider">
                <FaStethoscope className="w-4 h-4" />
                <span>Multi-Portal Synchronized System</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                All inquiries are automatically tagged for appropriate triage
                across Admin, Doctor, Receptionist, and Patient modules for
                rapid resolution.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Send Us a Message
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the details below. Required fields are marked with{" "}
                <span className="text-rose-500 font-bold">*</span>.
              </p>
            </div>

            {isSubmitted && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex items-start space-x-3">
                <FaCheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Message Received!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you! Our team will get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ram Prasad Shrestha"
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ram@example.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Phone Number{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977-98XXXXXXXX"
                    className={inputClass("phone")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Subject / Topic
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition appearance-none cursor-pointer pr-8"
                    >
                      <option value="Appointment Assistance">
                        Appointment Assistance
                      </option>
                      <option value="Patient Registration Support">
                        Patient Registration Support
                      </option>
                      <option value="Technical & Portal Assistance">
                        Technical & Portal Assistance
                      </option>
                      <option value="Doctor Schedule Information">
                        Doctor Schedule Information
                      </option>
                      <option value="Reception & Check-in Help">
                        Reception & Check-in Help
                      </option>
                      <option value="General Inquiry">
                        General Hospital Inquiry
                      </option>
                    </select>
                    <FaChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
                >
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your query in detail..."
                  className={`${inputClass("message")} resize-none`}
                ></textarea>
                {errors.message && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Message...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Emergency Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-widest uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                24/7 Critical Care
              </span>
              <h3 className="text-xl font-extrabold mt-2">
                Need Emergency Assistance?
              </h3>
              <p className="text-rose-100 text-sm mt-1 max-w-2xl leading-relaxed">
                For medical emergencies, please contact the hospital emergency
                department immediately. Do not rely on web forms for urgent
                care.
              </p>
            </div>
          </div>
          <a
            href={`tel:${HOSPITAL_CONFIG.emergencyPhone}`}
            className="shrink-0 bg-white hover:bg-rose-50 text-rose-700 font-extrabold py-3 px-6 rounded-2xl text-sm shadow-md flex items-center space-x-2.5"
          >
            <FaPhoneAlt className="w-4 h-4" />
            <span>Call Hospital Emergency</span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Help Center
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Quick answers regarding portal bookings, account assistance, and
            reception support.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              "All",
              "Patient Portal",
              "Account & Technical",
              "Reception",
              "Reports & Diagnostics",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  faqCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex justify-between items-center font-bold text-gray-800 hover:text-blue-600 transition"
                >
                  <span className="text-sm flex items-center space-x-2.5 pr-4">
                    <FaQuestionCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <FaChevronDown
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-200">
                      <span>
                        Category:{" "}
                        <strong className="text-gray-600">{faq.category}</strong>
                      </span>
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      >
                        Need further help?
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Contact;
