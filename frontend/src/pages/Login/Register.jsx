import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const getErrorMessage = (err) => {
  if (err.response?.status === 400 && err.response?.data) {
    if (typeof err.response.data === "object") {
      if (err.response.data.detail) {
        return err.response.data.detail;
      }

      const messages = Object.values(err.response.data).flatMap((value) =>
        Array.isArray(value) ? value : [value]
      );

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }

  return "Unable to connect to the server.";
};

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    blood_group: "",
    emergency_contact: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { first_name, email, username, password, confirmPassword } = formData;

    if (!first_name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All required fields must be filled.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        first_name: first_name.trim(),
        last_name: formData.last_name.trim(),
        email: email.trim(),
        username: username.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        blood_group: formData.blood_group,
        emergency_contact: formData.emergency_contact,
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Hospital Management System
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create an account to continue
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                First Name
              </label>

              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                autoComplete="given-name"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="First name"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Last Name
              </label>

              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                autoComplete="family-name"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Choose a username"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date_of_birth"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Date of Birth
              </label>

              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Contact number"
              />
            </div>

            <div>
              <label
                htmlFor="blood_group"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Blood Group
              </label>

              <select
                id="blood_group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="emergency_contact"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Emergency Contact
            </label>

            <input
              id="emergency_contact"
              name="emergency_contact"
              type="tel"
              value={formData.emergency_contact}
              onChange={handleChange}
              autoComplete="tel"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Emergency contact number"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="At least 8 characters"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;