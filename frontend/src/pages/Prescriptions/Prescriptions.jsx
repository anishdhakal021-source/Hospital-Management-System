import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getPrescriptions } from "../../services/prescriptionService";
import { useAuth } from "../../context/AuthContext";

const Prescriptions = () => {
  const navigate = useNavigate();
  const {user}=useAuth();
  const canCreatePrescription = user?.role === "ADMIN" || user?.role ==="DOCTOR";

  const {
    data: prescriptions,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: getPrescriptions,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-slate-500">Loading prescriptions...</p>
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
              "Failed to load prescriptions."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const prescriptionList = Array.isArray(prescriptions)
    ? prescriptions
    : prescriptions?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Prescriptions
            </h1>

            <p className="text-sm text-slate-500">
              Manage patient prescriptions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          {canCreatePrescription && (
            <button
              type="button"
              onClick={() => navigate("/prescriptions/new")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              New Prescription
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {prescriptionList.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <FileText
            size={40}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No prescriptions found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are no prescriptions available yet.
          </p>
        </div>
      ) : (
        /* Prescription Table */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Doctor
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {prescriptionList.map((prescription) => (
                  <tr
                    key={prescription.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      #{prescription.id}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {prescription.patient_name ||
                        `Patient #${prescription.patient_id}`}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {prescription.doctor_name ||
                        `Doctor #${prescription.doctor_id}`}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {prescription.prescribed_date || "-"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {prescription.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/prescriptions/${prescription.id}`
                          )
                        }
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
                      >
                        View
                      </button>
                    </td>
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

export default Prescriptions;