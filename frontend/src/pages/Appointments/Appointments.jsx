import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Plus,
  RefreshCw,
  UserX,
  X,
} from "lucide-react";

import {
  getAppointments,
  updateAppointment,
} from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

const Appointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const statusMutation = useMutation({
    mutationFn: ({ appointmentId, status }) =>
      updateAppointment(appointmentId, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
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

  const canChangeStatus = (appointment) => {
    if (appointment.status !== "SCHEDULED") {
      return false;
    }

    return (
      user?.role === "ADMIN" ||
      user?.role === "RECEPTIONIST" ||
      user?.role === "DOCTOR" ||
      user?.role === "PATIENT"
    );
  };

  const getAvailableActions = (appointment) => {
    if (!canChangeStatus(appointment)) {
      return [];
    }

    if (user?.role === "PATIENT") {
      return [
        {
          status: "CANCELLED",
          label: "Cancel",
          icon: X,
          className:
            "border-red-200 text-red-600 hover:bg-red-50",
        },
      ];
    }

    if (user?.role === "DOCTOR") {
      return [
        {
          status: "COMPLETED",
          label: "Complete",
          icon: Check,
          className:
            "border-green-200 text-green-600 hover:bg-green-50",
        },
        {
          status: "NO_SHOW",
          label: "No Show",
          icon: UserX,
          className:
            "border-yellow-200 text-yellow-600 hover:bg-yellow-50",
        },
      ];
    }

    return [
      {
        status: "COMPLETED",
        label: "Complete",
        icon: Check,
        className:
          "border-green-200 text-green-600 hover:bg-green-50",
      },
      {
        status: "NO_SHOW",
        label: "No Show",
        icon: UserX,
        className:
          "border-yellow-200 text-yellow-600 hover:bg-yellow-50",
      },
      {
        status: "CANCELLED",
        label: "Cancel",
        icon: X,
        className:
          "border-red-200 text-red-600 hover:bg-red-50",
      },
    ];
  };

  const handleStatusChange = (appointment, status) => {
    const action = formatStatus(status);

    const confirmed = window.confirm(
      `Are you sure you want to mark this appointment as ${action}?`
    );

    if (!confirmed) {
      return;
    }

    statusMutation.mutate({
      appointmentId: appointment.id,
      status,
    });
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

      {/* Mutation error */}
      {statusMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {statusMutation.error?.response?.data?.detail ||
            "Unable to update the appointment status."}
        </div>
      )}

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

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => {
                    const actions = getAvailableActions(appointment);

                    return (
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

                        <td className="px-6 py-4">
                          {actions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {actions.map((action) => {
                                const Icon = action.icon;
                                const isUpdating =
                                  statusMutation.isPending &&
                                  statusMutation.variables
                                    ?.appointmentId ===
                                    appointment.id;

                                return (
                                  <button
                                    key={action.status}
                                    type="button"
                                    disabled={
                                      statusMutation.isPending
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        appointment,
                                        action.status
                                      )
                                    }
                                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Icon className="h-3.5 w-3.5" />
                                    )}

                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {appointments.map((appointment) => {
              const actions = getAvailableActions(appointment);

              return (
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
                        Dr.{" "}
                        {appointment.doctor_name ||
                          "Unknown doctor"}
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

                  {/* Mobile actions */}
                  {actions.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {actions.map((action) => {
                          const Icon = action.icon;
                          const isUpdating =
                            statusMutation.isPending &&
                            statusMutation.variables
                              ?.appointmentId ===
                              appointment.id;

                          return (
                            <button
                              key={action.status}
                              type="button"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                handleStatusChange(
                                  appointment,
                                  action.status
                                )
                              }
                              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                            >
                              {isUpdating ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}

                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;