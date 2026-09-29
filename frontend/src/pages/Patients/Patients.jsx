import { useQuery } from "@tanstack/react-query";
import {
  UserPlus,
  RefreshCw,
  Eye,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

const Patients = () => {
  const { user } = useAuth();

  const {
    data: patients = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const canCreatePatient =
    user?.role === "ADMIN" ||
    user?.role === "RECEPTIONIST";

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-slate-600"
            size={28}
          />

          <p className="mt-3 text-slate-600">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load patients
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading patients."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Patients
            </h1>

            <p className="text-sm text-slate-500">
              Manage and view patient information.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          {canCreatePatient && (
            <Link
              to="/patients/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <UserPlus size={16} />
              Add Patient
            </Link>
          )}
        </div>
      </div>

      {/* Empty state */}
      {patients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Users
            size={40}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No patients found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no patient records available.
          </p>

          {canCreatePatient && (
            <Link
              to="/patients/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <UserPlus size={16} />
              Add First Patient
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop/tablet table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Gender
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Blood Group
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {patient.first_name ||
                            patient.last_name
                              ? `${patient.first_name || ""} ${
                                  patient.last_name || ""
                                }`.trim()
                              : patient.username}
                          </p>

                          <p className="text-sm text-slate-500">
                            @{patient.username}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.gender || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.blood_group || "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {patients.map((patient) => {
              const patientName =
                patient.first_name || patient.last_name
                  ? `${patient.first_name || ""} ${
                      patient.last_name || ""
                    }`.trim()
                  : patient.username;

              return (
                <div
                  key={patient.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-slate-800">
                        {patientName}
                      </h2>

                      <p className="text-sm text-slate-500">
                        @{patient.username}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {patient.blood_group || "N/A"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-slate-700">
                        Email:
                      </span>{" "}
                      <span className="text-slate-600">
                        {patient.email || "—"}
                      </span>
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Phone:
                      </span>{" "}
                      <span className="text-slate-600">
                        {patient.phone || "—"}
                      </span>
                    </p>

                    <p>
                      <span className="font-medium text-slate-700">
                        Gender:
                      </span>{" "}
                      <span className="text-slate-600">
                        {patient.gender || "—"}
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/patients/${patient.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Eye size={16} />
                    View Patient
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Patients;