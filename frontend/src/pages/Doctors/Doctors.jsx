import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Stethoscope, Pencil, Trash2 } from "lucide-react";

import { getDoctors, deleteDoctor } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";

const Doctors = () => {
  const navigate = useNavigate();
  const queryClient= useQueryClient();
  const { user } = useAuth();
  const canManageDoctors = user?.role === "ADMIN" || user?.role === "RECEPTIONIST";

  const {
    data: doctors = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const deleteMutation = useMutation({
      mutationFn: deleteDoctor,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["doctors"],
        });
      },
    });

  const handleDelete = (doctor) => {
    const doctorName =
      `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim() ||
      doctor.username;

    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${doctorName}? This will also delete the doctor's user account.`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(doctor.id);
  };        

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load doctors
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading doctors."}
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
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Doctors
              </h1>

              <p className="text-sm text-gray-500">
                View hospital doctors and their information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {canManageDoctors && (
            <button
              type="button"
              onClick={() => navigate("/doctors/new")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Doctor
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
      {doctors.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Stethoscope className="mx-auto h-10 w-10 text-gray-400" />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No doctors found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are currently no doctors available to display.
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
                      Doctor
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Specialization
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      License
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {doctor.first_name || doctor.last_name
                              ? `${doctor.first_name || ""} ${
                                  doctor.last_name || ""
                                }`.trim()
                              : doctor.username}
                          </p>

                          <p className="text-sm text-gray-500">
                            {doctor.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doctor.department_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doctor.specialization || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doctor.license_number || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doctor.phone || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            doctor.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {doctor.is_available
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        {canManageDoctors && (
                          <button
                            type="button"
                            onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                        )}

                        {canManageDoctors && (
                          <button
                            type="button"
                            onClick={() => handleDelete(doctor)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {doctors.map((doctor) => {
              const doctorName =
                doctor.first_name || doctor.last_name
                  ? `${doctor.first_name || ""} ${
                      doctor.last_name || ""
                    }`.trim()
                  : doctor.username;

              return (
                <div
                  key={doctor.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {doctorName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {doctor.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        doctor.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {doctor.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                    <p>
                      <span className="font-medium text-gray-700">
                        Department:
                      </span>{" "}
                      {doctor.department_name || "—"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">
                        Specialization:
                      </span>{" "}
                      {doctor.specialization || "—"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">
                        License:
                      </span>{" "}
                      {doctor.license_number || "—"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">
                        Phone:
                      </span>{" "}
                      {doctor.phone || "—"}
                    </p>

                    {canManageDoctors && (
                      <button
                        type="button"
                        onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    )}

                    {canManageDoctors && (
                      <button
                        type="button"
                        onClick={() => handleDelete(doctor)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Doctors;