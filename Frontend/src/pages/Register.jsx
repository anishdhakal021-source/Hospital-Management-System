import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import logo from "../assets/images/hospitalL.png";

const roles = [
  {
    id: "Admin",
    label: "Admin",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: "Doctor",
    label: "Doctor",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: "Patient",
    label: "Patient",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    id: "Receptionist",
    label: "Receptionist",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

function Register() {
  const [selectedRole, setSelectedRole] = useState("Patient");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Separate visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert(
      `Registration Request sent for ${fullName} as ${selectedRole}`
    );
  };

  return (
    <div className="bg-slate-50 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">

        {/* Logo */}
        <div className="flex justify-start mb-6">
          <img
            src={logo}
            alt="AasPaj HealthCare Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Create an Account
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Select your role to complete registration
          </p>
        </div>

        {/* Role Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex mb-6 gap-1 border border-slate-200">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`flex-1 py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-semibold ${isSelected
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
              >
                {role.icon}

                <span className="truncate">
                  {role.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Full Name
            </label>

            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition [&::-ms-reveal]:hidden"
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition [&::-ms-reveal]:hidden"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-100 mt-2 text-sm"
          >
            Register as {selectedRole}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 text-sm">
          <span className="font-medium text-slate-700">
            Already have an account?
          </span>{" "}

          <a
            href="#"
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
}

export default Register;