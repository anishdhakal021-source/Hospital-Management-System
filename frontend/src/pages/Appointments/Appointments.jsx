import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  RefreshCw,
} from "lucide-react";

import { getAppointments } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canCreateAppointment =
    user?.role === "ADMIN" ||
    user?.role === "RECEPTIONIST" ||
    user?.role === "DOCTOR" ||
    user?.role === "PATIENT";

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const getStatusClasses = (status) => {
    const statusClasses = {
      SCHEDULED: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
      NO_SHOW: "bg-yellow-100 text-yellow-700",
    };

    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-700"
    );
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-gray-600">
          Loading appointments...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load appointments
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading appointments."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointments
            </h1>

            <p className="text-sm text-gray-500">
              Manage and view hospital appointments.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {canCreateAppointment && (
            <button
              type="button"
              onClick={() => navigate("/appointments/new")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          )}

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Empty state */}
      {appointments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No appointments found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are currently no appointments to display.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Patient
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Doctor
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date & Time
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Reason
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {appointment.patient_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.doctor_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.department_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            appointment.status
                          )}`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {appointment.reason || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {appointment.patient_name || "Unknown patient"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Dr. {appointment.doctor_name || "Unknown doctor"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      appointment.status
                    )}`}
                  >
                    {formatStatus(appointment.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">
                      Department:
                    </span>{" "}
                    {appointment.department_name || "—"}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">
                      Date & Time:
                    </span>{" "}
                    {formatDate(
                      appointment.appointment_date
                    )}
                  </p>

                  <p>
                    <span className="font-medium text-gray-700">
                      Reason:
                    </span>{" "}
                    {appointment.reason || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;