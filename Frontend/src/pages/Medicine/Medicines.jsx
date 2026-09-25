import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Pill, Plus, Trash2 } from "lucide-react";

import { getMedicines, deleteMedicine } from "../../services/medicineService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { updateMedicine } from "../../services/medicineService";

const Medicines = () => {
    const { user }=useAuth();
    const canCreateMedicine = user?.role ==="ADMIN" || user?.role ==="PHARMACIST";
    const canEditMedicine = user?.role ==="ADMIN" || user?.role ==="PHARMACIST";
    const canDeleteMedicine = user?.role === "ADMIN";
    const canToggleMedicine =
  user?.role === "ADMIN" || user?.role === "PHARMACIST";
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
      mutationFn: deleteMedicine,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["medicines"],
        });
      },

      onError: (error) => {
        console.log(
          "Medicine deletion error:",
          error.response?.data
        );

        alert(
          error.response?.data
            ? JSON.stringify(error.response.data)
            : "Unable to delete the medicine."
        );
      },
    });

    const toggleActiveMutation = useMutation({
      mutationFn: ({ medicineId, isActive }) =>
        updateMedicine(medicineId, {
          is_active: isActive,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["medicines"],
        });
      },

      onError: (error) => {
        console.error("Failed to update medicine status:", error);
        alert("Failed to update medicine status.");
      },
    });

  const {
    data: medicines = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });


  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Medicines
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View medicines available in the hospital pharmacy.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
                />
                Refresh
            </button>

            {canCreateMedicine && (
                <button
                type="button"
                onClick={() => navigate("/medicines/new")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                <Plus size={16} />
                Add Medicine
                </button>
            )}
            </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Loading medicines...
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Failed to load medicines.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && medicines.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Pill className="mx-auto mb-3 text-gray-400" size={40} />

          <h2 className="text-lg font-semibold text-gray-800">
            No medicines found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no medicines in the system.
          </p>
        </div>
      )}

      {/* Medicine table */}
      {!isLoading && !isError && medicines.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Medicine
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Generic Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Manufacturer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  {canEditMedicine && (
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {medicines.map((medicine) => (
                  <tr
                    key={medicine.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {medicine.name}
                      </div>

                      {medicine.description && (
                        <div className="mt-1 max-w-xs truncate text-sm text-gray-500">
                          {medicine.description}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {medicine.generic_name || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {medicine.category || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {medicine.manufacturer || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          medicine.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {medicine.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {(canEditMedicine || canDeleteMedicine) && (
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          {canEditMedicine && (
                            <Link
                              to={`/medicines/${medicine.id}/edit`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </Link>
                          )}

                          {canDeleteMedicine && (
                            <button
                              type="button"
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Are you sure you want to delete "${medicine.name}"?`
                                );

                                if (confirmed) {
                                  deleteMutation.mutate(medicine.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          )}

                          {canToggleMedicine && (
                            <button
                              type="button"
                              onClick={() => {
                                const action = medicine.is_active
                                  ? "deactivate"
                                  : "activate";

                                if (
                                  window.confirm(
                                    `Are you sure you want to ${action} ${medicine.name}?`
                                  )
                                ) {
                                  toggleActiveMutation.mutate({
                                    medicineId: medicine.id,
                                    isActive: !medicine.is_active,
                                  });
                                }
                              }}
                              className="text-sm font-medium hover:underline"
                            >
                              {medicine.is_active ? "Deactivate" : "Activate"}
                            </button>
                          )}
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
    </div>
  );
};

export default Medicines;