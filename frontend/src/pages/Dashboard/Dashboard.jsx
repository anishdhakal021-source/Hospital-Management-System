import { Link } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  FileText,
  Stethoscope,
  Users,
  Building2,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const roleSections = {
  ADMIN: [
    { to: "/users", label: "Users", description: "Manage accounts and roles", icon: Users },
    { to: "/patients", label: "Patients", description: "View and update patients", icon: Users },
    { to: "/doctors", label: "Doctors", description: "Manage doctor profiles", icon: Stethoscope },
    { to: "/departments", label: "Departments", description: "Manage departments", icon: Building2 },
    { to: "/appointments", label: "Appointments", description: "Schedule and track visits", icon: CalendarDays },
    { to: "/medical-records", label: "Medical Records", description: "Review patient records", icon: FileText },
    { to: "/prescriptions", label: "Prescriptions", description: "Track prescriptions", icon: FileText },
  ],
  DOCTOR: [
    { to: "/appointments", label: "Appointments", description: "Today's schedule", icon: CalendarDays },
    { to: "/patients", label: "Patients", description: "View assigned patients", icon: Users },
    { to: "/medical-records", label: "Medical Records", description: "Write and review records", icon: FileText },
    { to: "/prescriptions", label: "Prescriptions", description: "Issue prescriptions", icon: FileText },
  ],
  RECEPTIONIST: [
    { to: "/appointments", label: "Appointments", description: "Schedule and track visits", icon: CalendarDays },
    { to: "/patients", label: "Patients", description: "Register and update patients", icon: Users },
    { to: "/doctors", label: "Doctors", description: "View doctor information", icon: Stethoscope },
  ],
  PATIENT: [
    { to: "/appointments", label: "My Appointments", description: "View and manage your visits", icon: CalendarDays },
    { to: "/medical-records", label: "My Medical Records", description: "Review your health records", icon: FileText },
    { to: "/prescriptions", label: "My Prescriptions", description: "See your active prescriptions", icon: FileText },
  ],
  PHARMACIST: [
    { to: "/medicine", label: "Medicine", description: "Manage stock and batches", icon: Stethoscope },
    { to: "/prescriptions", label: "Prescriptions", description: "Review prescriptions", icon: FileText },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();

  const sections = roleSections[user?.role] ?? [];

  if (sections.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            No dashboard sections are available for this account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-50 p-2">
          <LayoutDashboard className="h-6 w-6 text-emerald-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of your workspace.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-50">
          {user?.role ? `${user.role} Portal` : "Portal"}
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Welcome, {user?.username}
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-emerald-50">
          Use the shortcuts below to jump into the sections available for your
          role.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Quick Access
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map(({ to, label, description, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-emerald-50 p-2">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>

                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                {label}
              </p>
              <p className="mt-1 text-xs text-slate-500">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
