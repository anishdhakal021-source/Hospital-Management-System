import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Hospital Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              AasPaj Life Care Hospital
            </h2>

            <p className="text-gray-400 leading-6">
              Providing quality healthcare services with trusted doctors
              and modern medical facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white">
                  Doctors
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white">
                  Appointments
                </a>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Departments
            </h3>

            <ul className="space-y-2">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Orthopedics</li>
              <li>Pediatrics</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>📍 Kathmandu, Nepal</li>
              <li>📞 +977 9800000000</li>
              <li>✉️ info@AasPaj.com</li>
              <li>🕐 Open 24/7</li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            © 2026 info@AasPaj.com. All rights reserved.
          </p>
        </div>

      </div>

    </footer>
  );
};

export default Footer;