import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, loading, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    setNotice("");

    if (!formData.username.trim() || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      await login(formData.username, formData.password);

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 font-sans antialiased selection:bg-teal-500 selection:text-white sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-start">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <Link
            to="/"
            aria-label="Back to HMS home"
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-2xl font-black tracking-tight text-slate-900">
                HMS
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Hospital Management System
              </span>
            </div>
          </Link>

          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Secure access
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {notice && (
            <div className="mb-5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Enter username"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Password reset is not available yet. Please contact the system administrator."
                    )
                  }
                  className="text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-600"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white shadow-md shadow-teal-600/25 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-600 transition hover:text-teal-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;