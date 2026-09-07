import { useNavigate } from "react-router-dom";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Building2 } from "lucide-react";

import { getDepartments, deleteDepartment } from "../../services/departmentService";
import { useAuth } from "../../context/AuthContext";

const Departments = () => {
  const { user } = useAuth();

  const {
    data: departments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });

  const handleDelete = (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(department.id);
  };

  const navigate = useNavigate();

  const canManageDepartments =
    user?.role === "ADMIN" || user?.role === "RECEPTIONIST";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />

            <h1 className="text-2xl font-bold text-gray-900">
              Departments
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Manage hospital departments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          {canManageDepartments && (
            <button
                type="button"
                onClick={() => navigate("/departments/new")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                Add Department
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Loading departments...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Failed to load departments
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error?.response?.data?.detail ||
              "Something went wrong while loading departments."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {deleteMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteMutation.error?.response?.data?.detail ||
            "This department could not be deleted. It may have doctors assigned to it."}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && departments.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-gray-400" />

          <h2 className="mt-3 font-semibold text-gray-900">
            No departments found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no departments in the system.
          </p>
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && !isError && departments.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  {canManageDepartments && (
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {department.name}
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                      {department.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          department.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {department.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {canManageDepartments && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/departments/${department.id}/edit`)
                            }
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(department)}
                            disabled={deleteMutation.isPending}
                            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && !isError && departments.length > 0 && (
        <div className="space-y-3 md:hidden">
          {departments.map((department) => (
            <div
              key={department.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {department.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {department.description || "No description"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    department.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {department.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {canManageDepartments && (
                <div className="mt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/departments/${department.id}/edit`)
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(department)}
                    disabled={deleteMutation.isPending}
                    className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;