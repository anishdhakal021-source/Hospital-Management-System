import { Link } from "react-router-dom";
import logo from "../assets/images/hospitalL.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Hospital Logo / Name */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="AasPaj LifeCare Hospital Logo"
                className="h-53 w-50 object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>

            <Link
              to="/doctors"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Doctors
            </Link>

            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Services
            </Link>

            <Link
              to="/departments"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Departments
            </Link>

            <Link
              to="/appointments"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Appointments
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>

          </div>

          {/* Login / Register */}
          <div className="hidden md:flex items-center space-x-3">

            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;