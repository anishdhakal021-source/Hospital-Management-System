import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { getMedicineBatches } from "../../services/medicineService";

const MedicineBatches = () => {
  const {
    data: batches = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["medicine-batches"],
    queryFn: getMedicineBatches,
  });

  const { user } = useAuth();

  const canCreateBatch = user?.role === "ADMIN" || user?.role === "PHARMACIST";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Batches</h1>

          <p className="mt-1 text-sm text-gray-500">
            View medicine batches and their available stock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>

        {canCreateBatch && (
          <Link
            to="/medicine-batches/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Batch
          </Link>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading medicine batches...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Failed to load medicine batches.
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

      {/* Empty */}
      {!isLoading && !isError && batches.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Package className="mx-auto mb-3 text-gray-400" size={40} />

          <h2 className="text-lg font-semibold text-gray-800">
            No medicine batches found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no medicine batches in the system.
          </p>
        </div>
      )}

      {/* Batch table */}
      {!isLoading && !isError && batches.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Medicine
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Batch Number
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Expiry Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Quantity
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Purchase Price
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Selling Price
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {batch.medicine_name}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {batch.batch_number}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {batch.expiry_date}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {batch.quantity}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {batch.purchase_price}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {batch.selling_price}
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

export default MedicineBatches;