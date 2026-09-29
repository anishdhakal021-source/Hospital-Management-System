import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, Phone, Calendar, Clock, MapPin, Mail, 
  Stethoscope, FileText, ChevronRight, CheckCircle2, 
  UserPlus, LogIn, Award, Users, Ambulance, 
  Video, Microchip, Lock, ArrowRight, Menu, X, Send, Info
} from 'lucide-react';

import { getPublicDepartments } from '../../services/departmentService';
import { getPublicDoctors } from '../../services/doctorService';

const CORE_SERVICES = [
  {
    title: '24/7 Emergency & Ambulance',
    desc: 'Immediate response team equipped with advanced life support vehicles and emergency hotline.',
    icon: Ambulance,
    badge: 'Critical Care'
  },
  {
    title: 'Online Doctor Booking',
    desc: 'Select preferred doctors, view real-time slot availability, and receive instant confirmations.',
    icon: Calendar,
    badge: 'Seamless'
  },
  {
    title: 'Electronic Health Records (EHR)',
    desc: 'Securely store and retrieve lab results, digital prescriptions, x-rays, and medical history in one place.',
    icon: FileText,
    badge: 'Compliant'
  },
  {
    title: 'Virtual Teleconsultations',
    desc: 'Connect with certified specialists via secure encrypted video sessions from anywhere.',
    icon: Video,
    badge: 'Remote Access'
  },
  {
    title: 'Diagnostic & Lab Integration',
    desc: 'Automated notification when test results are processed with direct download options.',
    icon: Microchip,
    badge: 'Fast Results'
  },
  {
    title: 'Pharmacy & Prescriptions',
    desc: 'E-prescriptions sent directly to our central pharmacy for express home delivery or quick pickup.',
    icon: CheckCircle2,
    badge: 'Convenient'
  }
];

export default function Home() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(
    location.state?.department || 'all'
  );
  const [bookingPromptOpen, setBookingPromptOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const {
    data: apiDepartments = [],
    isLoading: departmentsLoading
  } = useQuery({
    queryKey: ['public', 'departments'],
    queryFn: getPublicDepartments,
    staleTime: 0
  });

  const {
    data: apiDoctors = [],
    isLoading: doctorsLoading
  } = useQuery({
    queryKey: ['public', 'doctors'],
    queryFn: getPublicDoctors,
    staleTime: 0
  });

  const doctors = apiDoctors;
  const departments = apiDepartments;

  const visibleDoctors =
    selectedDept === 'all'
      ? doctors
      : doctors.filter((doctor) => doctor.department_name === selectedDept);

  // Form state for Contact Us
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    const hashId = location.hash ? location.hash.slice(1) : '';
    const sectionId = hashId || location.pathname.slice(1);
    const section = sectionId ? document.getElementById(sectionId) : null;

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', department: 'General Inquiry', message: '' });
    }, 4000);
  };

  const handleBookingAttempt = (doc = null) => {
    if (doc) {
      setSelectedDoctor(doc);
    }
    setBookingPromptOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {}
      <div className="bg-slate-900 text-slate-300 text-xs sm:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-rose-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              Emergency: <a href="tel:056000" className="text-white hover:underline font-bold ml-1">056000</a>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-teal-400" /> Phone: <a href="tel:9700000000" className="text-white font-semibold hover:underline">9700000000</a>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> Kathmandu, Nepal</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-teal-400" /> Hms777@gmail.com</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-400" /> Sun - Fri (8:00 AM - 6:00 PM)</span>
          </div>
        </div>
      </div>

      {}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  HMS
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Hospital Management System
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-600 text-sm">
              <a href="/#services" className="hover:text-teal-600 transition">Services</a>
              <a href="/#doctors" className="hover:text-teal-600 transition">Doctors</a>
              <a href="/#departments" className="hover:text-teal-600 transition">Departments</a>
              <a href="/#about" className="hover:text-teal-600 transition">About Us</a>
              <a href="/#contact" className="hover:text-teal-600 transition">Contact Us</a>
            </div>

            {/* Direct Link Action Buttons: Login & Register */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition flex items-center gap-2 border border-slate-200"
              >
                <LogIn className="w-4 h-4 text-teal-600" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/25 transition flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex sm:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium border-b border-slate-100">Services</a>
            <a href="/#doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium border-b border-slate-100">Doctors</a>
            <a href="/#departments" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium border-b border-slate-100">Departments</a>
            <a href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium border-b border-slate-100">About Us</a>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium border-b border-slate-100">Contact Us</a>
            
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-center flex justify-center items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-teal-600" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold text-center flex justify-center items-center gap-2 shadow"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {}
      <section id="home" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100/60 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Modern Healthcare & Management Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
                Welcome to <span className="text-teal-600">HMS</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600">
                  Care & Efficiency Together
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with certified specialists, manage prescriptions, book appointments, and track medical diagnostics in Kathmandu, Nepal.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => handleBookingAttempt()}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-center shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-center shadow-sm transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-teal-600" />
                  <span>Register Account</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    {apiDoctors.length || '—'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {apiDoctors.length ? 'Available Doctors' : 'Doctors coming soon'}
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">9700000000</h4>
                  <p className="text-xs text-slate-500 font-medium">Hospital Contact</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">100k+</h4>
                  <p className="text-xs text-slate-500 font-medium">Happy Patients</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">Kathmandu</h4>
                  <p className="text-xs text-slate-500 font-medium">Nepal Location</p>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" 
                    alt="HMS Hospital" 
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-100 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">HMS Quality Care</h4>
                        <p className="text-xs text-slate-500">Kathmandu, Nepal • Phone: 9700000000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section id="services" className="scroll-mt-20 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-600 text-xs font-bold uppercase tracking-widest">Medical Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Services
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Equipped with medical technologies and integrated management tools to provide fast, reliable care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_SERVICES.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-50 hover:bg-slate-100/80 p-8 rounded-2xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-110 transition-transform">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  {service.title.includes('Booking') ? (
                    <button 
                      onClick={() => handleBookingAttempt()}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Book Appointment <Lock className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700">
                      Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {}
      <section id="departments" className="scroll-mt-20 py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-teal-600 text-xs font-bold uppercase tracking-widest">Specialized Wings</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                Departments
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Our specialized departments are staffed by trained surgeons, physicians, and medical researchers.
            </p>
          </div>

          {departmentsLoading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <Stethoscope className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">Departments are currently unavailable</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Departments added by the hospital admin will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => {
                const specialistsCount = doctors.filter(
                  (doctor) => doctor.department_name === dept.name
                ).length;

                return (
                  <div
                    key={dept.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl border border-teal-100 bg-teal-50 text-teal-600">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                        <span className="text-xs text-slate-500">
                          {specialistsCount} {specialistsCount === 1 ? 'specialist' : 'specialists'} available
                        </span>
                      </div>
                    </div>

                    {dept.description && (
                      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {dept.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href="/#doctors"
                        onClick={() => setSelectedDept(dept.name)}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        Find Specialist <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {}
      <section id="doctors" className="scroll-mt-20 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-teal-600 text-xs font-bold uppercase tracking-widest">Medical Staff</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Doctors
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Browse board-certified doctors. Login to book consultation appointments.
            </p>
          </div>

          {doctorsLoading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading doctors...
            </div>
          ) : visibleDoctors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <Stethoscope className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">
                {selectedDept === 'all'
                  ? 'Doctors are currently unavailable'
                  : 'No doctors available for this department'}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Doctors added by the hospital admin will appear here.
              </p>
              {selectedDept !== 'all' && (
                <button
                  onClick={() => setSelectedDept('all')}
                  className="mt-5 text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  View all doctors
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDoctors.map((doc) => {
                const name = doc.name || 'HMS Specialist';
                const specialization = doc.specialization || 'Medical Specialist';
                const department = doc.department_name || 'General Medicine';
                const availability = doc.is_available
                  ? 'Available Today'
                  : 'Currently unavailable';
                const initials = name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-40 overflow-hidden bg-slate-100 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-black text-teal-700">
                          {initials || 'HMS'}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {availability}
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                          {department}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">{name}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-3">{specialization}</p>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {doc.is_available ? 'Accepting appointments' : 'Not accepting appointments'}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleBookingAttempt(doc)}
                        className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-teal-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-teal-400" />
                        Book Consultation
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {}
      <section id="about" className="scroll-mt-20 py-20 bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Our Heritage & Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                About Us
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                HMS (Hospital Management System) is a premier healthcare institution based in Kathmandu, Nepal. Dedicated to delivering compassionate medical treatment combined with cutting-edge health informatics, we bring patient care into the modern era.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Patient-Centric Approach</h4>
                    <p className="text-xs text-slate-600">Open registration for instant access to doctor slots, e-prescriptions, and medical reports once logged in.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Admin-Verified Specialists</h4>
                    <p className="text-xs text-slate-600">Ensuring highest quality healthcare standards through strictly verified medical professionals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">24/7 Emergency Readiness</h4>
                    <p className="text-xs text-slate-600">Equipped with Level 1 trauma facilities and rapid response teams reachable at 056000.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <Award className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-slate-900">15+</h3>
                  <p className="text-xs text-slate-500 font-medium">Years of Service</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-slate-900">100k+</h3>
                  <p className="text-xs text-slate-500 font-medium">Patients Served</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <Stethoscope className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-slate-900">
                    {apiDoctors.length || '—'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {apiDoctors.length ? 'Available Doctors' : 'Doctors coming soon'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <Shield className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-slate-900">100%</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified Protocols</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section id="contact" className="scroll-mt-20 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-600 text-xs font-bold uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Contact Us
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Have questions regarding registration, appointment scheduling, or hospital inquiries? Reach out to us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Emergency Call Box */}
              <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Ambulance className="w-7 h-7" />
                  <h3 className="text-xl font-bold">24/7 Emergency Line</h3>
                </div>
                <p className="text-rose-100 text-xs mb-4">
                  For immediate critical care or ambulance dispatch, call our emergency hotline instantly.
                </p>
                <a 
                  href="tel:056000" 
                  className="text-3xl font-black tracking-wide text-white bg-white/20 hover:bg-white/30 py-2.5 px-6 rounded-xl inline-block transition"
                >
                  056000
                </a>
              </div>

              {/* Location & Contact Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Hospital Contact Number</h4>
                    <p className="text-sm font-semibold text-teal-700 mt-0.5">
                      <a href="tel:9700000000" className="hover:underline">9700000000</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Hospital Location</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Email Address</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Hms777@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Working Days & Hours</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Sun - Fri (8:00 AM - 6:00 PM)<br />
                      Emergency Department: 24/7
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-500 mb-6">Fill out the form below and our staff will respond promptly.</p>

              {contactSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-700">Thank you for reaching out to HMS. We will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Your Name" 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="Hms777@gmail.com" 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="9700000000" 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <select 
                        value={contactForm.department}
                        onChange={(e) => setContactForm({...contactForm, department: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option>General Inquiry</option>
                        {departments.map((department) => (
                          <option key={department.id} value={department.name}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                    <textarea 
                      rows="4" 
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Please describe how we can assist you..." 
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {}
      <footer className="bg-slate-950 text-slate-400 text-xs py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  HMS
                </span>
              </Link>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                HMS is a hospital management system dedicated to healthcare services, simplified online booking, and secure medical care in Kathmandu, Nepal.
              </p>
              <div className="space-y-1">
                <p className="text-white font-bold">Hospital Phone: 9700000000</p>
                <p className="text-rose-400 font-bold">Emergency Hotline: 056000</p>
              </div>
              <div className="pt-2 text-slate-500">
                <p>© {new Date().getFullYear()} HMS. All rights reserved.</p>
              </div>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2">
            <li><a href="/#services" className="hover:text-teal-400 transition">Services</a></li>
            <li><a href="/#doctors" className="hover:text-teal-400 transition">Doctors</a></li>
            <li><a href="/#departments" className="hover:text-teal-400 transition">Departments</a></li>
            <li><a href="/#about" className="hover:text-teal-400 transition">About Us</a></li>
            <li><a href="/#contact" className="hover:text-teal-400 transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-3">System Access</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register" className="hover:text-teal-400 transition">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-teal-400 transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-3">Hospital Details</h4>
              <p className="text-xs text-slate-400 mb-1">📞 Phone: 9700000000</p>
              <p className="text-xs text-slate-400 mb-1">📍 Kathmandu, Nepal</p>
              <p className="text-xs text-slate-400 mb-1">✉️ Hms777@gmail.com</p>
              <p className="text-xs text-slate-400 mb-1">🕒 Sun - Fri (8:00 AM - 6:00 PM)</p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>HMS • Hospital Management System</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {}
      {bookingPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 text-center">
            <button 
              onClick={() => { setBookingPromptOpen(false); setSelectedDoctor(null); }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Login Required</h3>

            {selectedDoctor ? (
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                You must login to book an appointment or consultation with <strong className="text-slate-900">{selectedDoctor.name}</strong> ({selectedDoctor.department_name || 'the hospital'}). Please login to your account or register a new patient account to proceed.
              </p>
            ) : (
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                You must login to book an appointment or consultation. Please login to your account or register a new patient account first.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login First</span>
              </Link>

              <Link
                to="/register"
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition flex items-center justify-center gap-2 border border-slate-300"
              >
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>Register Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}