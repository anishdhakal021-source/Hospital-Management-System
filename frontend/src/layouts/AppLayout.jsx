import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  Pill,
  Receipt,
  LogOut,
  Menu,
  X,
  Building2,
  FileText,
  Package,
  CreditCard,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";



const navigationByRole = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/users", icon: Users },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Doctors", path: "/doctors", icon: Stethoscope },
    { label: "Departments", path: "/departments", icon: Building2 },
    { label: "Appointments", path: "/appointments", icon: CalendarDays },
    { label: "Medical Records", path: "/medical-records", icon: FileText },
    { label: "Prescriptions", path: "/prescriptions", icon: Pill },
    { label: "Pharmacy", path: "/pharmacy", icon: Package },
    { label: "Billing", path: "/billing", icon: Receipt },
    { label: "Payments", path: "/payments", icon: CreditCard },
  ],

  DOCTOR: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Appointments", path: "/appointments", icon: CalendarDays },
    { label: "Medical Records", path: "/medical-records", icon: FileText },
    { label: "Prescriptions", path: "/prescriptions", icon: Pill },
  ],

  RECEPTIONIST: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Doctors", path: "/doctors", icon: Stethoscope },
    { label: "Departments", path: "/departments", icon: Building2 },
    { label: "Appointments", path: "/appointments", icon: CalendarDays },
  ],

  PHARMACIST: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Medicines", path: "/medicines", icon: Pill },
    { label: "Prescriptions", path: "/prescriptions", icon: FileText },
    { label: "Dispensing", path: "/dispensing", icon: Package },
  ],

  ACCOUNTANT: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Billing", path: "/billing", icon: Receipt },
    { label: "Payments", path: "/payments", icon: CreditCard },
  ],

  PATIENT: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Appointments", path: "/appointments", icon: CalendarDays },
    { label: "My Medical Records", path: "/medical-records", icon: FileText },
    { label: "My Prescriptions", path: "/prescriptions", icon: Pill },
  ],
};

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          flex flex-col
          transform bg-slate-950 text-white
          transition-transform duration-300
          md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Sidebar header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                HMS
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Hospital Management System
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {(navigationByRole[user?.role] || []).map((item) => {
                const Icon = item.icon;

                return (
                <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition hover:bg-slate-900 hover:text-teal-300"
                >
                    <Icon size={20} />
                    <span>{item.label}</span>
                </Link>
                );
            })}
        </nav>

        {/* Logout */}
        <div className="mt-auto w-full shrink-0 border-t border-slate-800 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 transition hover:bg-slate-900 hover:text-teal-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                Hospital Management System
              </h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Manage hospital operations
              </p>
            </div>
          </div>

          {/* User information */}
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800 sm:text-base">
              {user?.username}
            </p>

            <p className="text-xs text-slate-500 sm:text-sm">
              {user?.role}
            </p>
          </div>
        </header>

        {/* Page */}
        <main className="p-4 sm:p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;