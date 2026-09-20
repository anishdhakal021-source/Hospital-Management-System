import { useQuery } from "@tanstack/react-query";
import { FileText, RefreshCw } from "lucide-react";
import {useNavigate} from "react-router-dom"
import { getMedicalRecords } from "../../services/medicalRecordService";

const MedicalRecords = () => {
  const navigate = useNavigate();

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["medical-records"],
    queryFn: getMedicalRecords,
  });


  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Medical Records
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage patient medical records.
          </p>
        </div>


         <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/medical-records/new")}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Record
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={isFetching ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-gray-400"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading medical records...
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Failed to load medical records
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error?.response?.data?.detail ||
              "Something went wrong while loading the records."}
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

      {/* Empty state */}
      {!isLoading && !isError && records.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <FileText
            size={40}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No medical records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are no medical records available.
          </p>
        </div>
      )}

      {/* Records table */}
      {!isLoading && !isError && records.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Patient
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Doctor
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Diagnosis
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {records.map((record) => (
                  <tr
                    key={record.id}
                    onClick={()=> navigate(`/medical-records/${record.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {record.patient_name || `Patient #${record.patient_id}`}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {record.doctor_name || `Doctor #${record.doctor_id}`}
                    </td>

                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
                      {record.diagnosis}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleDateString()
                        : "-"}
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

export default MedicalRecords;