import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMedicalRecord,
  updateMedicalRecord,
} from "../../services/medicalRecordService";

const EditMedicalRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    notes: "",
  });

  const [formError, setFormError] = useState("");

  const {
    data: record,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecord(id),
  });

  // Fill the form after the medical record is loaded.
  if (
    record &&
    formData.diagnosis === "" &&
    record.diagnosis !== undefined
  ) {
    setFormData({
      diagnosis: record.diagnosis || "",
      symptoms: record.symptoms || "",
      notes: record.notes || "",
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data) => updateMedicalRecord(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medical-records"],
      });

      queryClient.invalidateQueries({
        queryKey: ["medical-record", id],
      });

      navigate(`/medical-records/${id}`);
    },

    onError: (error) => {
      const backendError = error?.response?.data;

      if (backendError?.detail) {
        setFormError(backendError.detail);
      } else {
        setFormError(
          "Unable to update the medical record. Please check the form."
        );
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.diagnosis.trim()) {
      setFormError("Diagnosis is required.");
      return;
    }

    updateMutation.mutate({
      diagnosis: formData.diagnosis.trim(),
      symptoms: formData.symptoms.trim(),
      notes: formData.notes.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">
        Loading medical record...
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Unable to load the medical record.
        </p>

        <button
          type="button"
          onClick={() => navigate("/medical-records")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <ArrowLeft size={18} />
          Back to Medical Records
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/medical-records/${id}`)}
          className="rounded-lg border p-2 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Medical Record
          </h1>

          <p className="text-sm text-gray-500">
            Update the medical information below.
          </p>
        </div>
      </div>

      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        {/* Patient is displayed but cannot be changed. */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Patient
          </label>

          <input
            type="text"
            value={
              record.patient_name ||
              `Patient #${record.patient_id}`
            }
            disabled
            className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-600"
          />
        </div>

        {/* Doctor is displayed but cannot be changed. */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Doctor
          </label>

          <input
            type="text"
            value={
              record.doctor_name ||
              `Doctor #${record.doctor_id}`
            }
            disabled
            className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-600"
          />
        </div>

        <div>
          <label
            htmlFor="diagnosis"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Diagnosis
          </label>

          <input
            id="diagnosis"
            name="diagnosis"
            type="text"
            value={formData.diagnosis}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            placeholder="Enter diagnosis"
          />
        </div>

        <div>
          <label
            htmlFor="symptoms"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Symptoms
          </label>

          <textarea
            id="symptoms"
            name="symptoms"
            rows="4"
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            placeholder="Enter symptoms"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            placeholder="Enter additional notes"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/medical-records/${id}`)}
            className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicalRecord;