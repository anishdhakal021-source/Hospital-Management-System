import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  User,
  Stethoscope,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getMedicalRecord, deleteMedicalRecord } from "../../services/medicalRecordService";

const MedicalRecordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient=useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: ()=>deleteMedicalRecord(id),

    onSuccess: ()=> {
      queryClient.invalidateQueries({
        queryKey: ["medical-records"],
      });

      navigate("/medical-records/");
    },
  });


  const handleDelete=()=>{
    const confirmed =window.confirm(
      "Are you sure that you want to delete this medical records? "
    );

    if(!confirmed){
      return;
    }

    deleteMutation.mutate();
  };

  const {
    data: record,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecord(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <RefreshCw
          size={30}
          className="mx-auto animate-spin text-gray-400"
        />

        <p className="mt-3 text-sm text-gray-500">
          Loading medical record...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 text-red-600" size={22} />

          <div>
            <h2 className="font-semibold text-red-800">
              Failed to load medical record
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error?.response?.data?.detail ||
                "The medical record could not be loaded."}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={isFetching ? "animate-spin" : ""}
                />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/medical-records")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/medical-records")}
            className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
            aria-label="Back to medical records"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Record
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Record #{record.id}
            </p>
          </div>
        </div>

        {/* Record actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/medical-records/${id}/edit`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Patient and Doctor */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <User size={20} className="text-gray-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Patient</p>

              <p className="font-semibold text-gray-900">
                {record.patient_name || `Patient #${record.patient_id}`}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Stethoscope size={20} className="text-gray-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Doctor</p>

              <p className="font-semibold text-gray-900">
                {record.doctor_name || `Doctor #${record.doctor_id}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-gray-600" />

          <h2 className="text-lg font-semibold text-gray-900">
            Diagnosis
          </h2>
        </div>

        <p className="mt-4 text-gray-700">
          {record.diagnosis || "-"}
        </p>
      </div>

      {/* Symptoms */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Symptoms
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-gray-700">
          {record.symptoms || "-"}
        </p>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Notes
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-gray-700">
          {record.notes || "-"}
        </p>
      </div>

      {/* Dates */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <CalendarDays size={20} className="text-gray-600" />

          <h2 className="text-lg font-semibold text-gray-900">
            Record Information
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(record.created_at)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Updated
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(record.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetails;