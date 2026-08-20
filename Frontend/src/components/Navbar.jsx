import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Hospital Logo / Name */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              AasPaj LifeCare Hospital
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Departments
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Doctors
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Appointments
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </a>
          </div>

          {/* Login / Register */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              Login
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Register
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;