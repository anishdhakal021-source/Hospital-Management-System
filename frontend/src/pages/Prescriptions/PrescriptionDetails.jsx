import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getPrescription,getPrescriptionItems, deletePrescriptionItem } from "../../services/prescriptionService";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient= useQueryClient();
  const deleteItemMutation = useMutation({
    mutationFn: deletePrescriptionItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prescription-items"],
      });
    },
  });

  const {
    data: prescription,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescription(id),
    enabled: Boolean(id),
  });

  const {
    data: prescriptionItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useQuery({
    queryKey: ["prescription-items"],
    queryFn: getPrescriptionItems,
  });

  const items = Array.isArray(prescriptionItems)
    ? prescriptionItems.filter(
        (item) => item.prescription === Number(id)
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-gray-500">Loading prescription...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p>
            {error?.response?.data?.detail ||
              "Failed to load prescription."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Try Again
        </button>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-500">Prescription not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/prescriptions")}
          className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
          aria-label="Back to prescriptions"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Prescription
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Prescription #{prescription.id}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Prescription Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="mt-1 font-medium text-gray-900">
              {prescription.patient_name ||
                `Patient #${prescription.patient_id}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="mt-1 font-medium text-gray-900">
              {prescription.doctor_name ||
                `Doctor #${prescription.doctor_id}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Medical Record
            </p>
            <p className="mt-1 font-medium text-gray-900">
              #{prescription.medical_record_id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Prescribed Date
            </p>
            <p className="mt-1 font-medium text-gray-900">
              {prescription.prescribed_date || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {prescription.status}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Instructions
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {prescription.instructions || "No instructions provided."}
        </p>
      </div>

      {/* Medicine Items */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Medicines
        </h2>

        {isItemsLoading ? (
          <p className="mt-4 text-sm text-gray-500">
            Loading medicines...
          </p>
        ) : isItemsError ? (
          <p className="mt-4 text-sm text-red-600">
            Failed to load prescription medicines.
          </p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No medicines added to this prescription.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Medicine
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Dosage
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Frequency
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Duration
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.medicine_name || `Medicine #${item.medicine}`}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.dosage}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.frequency}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.duration}
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to remove this medicine?"
                          );

                          if (confirmed) {
                            deleteItemMutation.mutate(item.id);
                          }
                        }}
                        disabled={deleteItemMutation.isPending}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/prescriptions/${id}/items/${item.id}/edit`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetails;