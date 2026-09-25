import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getPrescription,
  updatePrescription,
} from "../../services/prescriptionService";

function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    instructions: "",
    status: "",
  });

  const [error, setError] = useState("");

  // Load the existing prescription.
  const {
    data: prescription,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescription(id),
    enabled: Boolean(id),
  });

  // Fill the form after the prescription is loaded.
  useEffect(() => {
    if (prescription) {
      setFormData({
        instructions: prescription.instructions || "",
        status: prescription.status || "",
      });
    }
  }, [prescription]);

  const updateMutation = useMutation({
    mutationFn: (data) => updatePrescription(id, data),

    onSuccess: () => {
      // Refresh the prescription details after updating.
      queryClient.invalidateQueries({
        queryKey: ["prescription", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["prescriptions"],
      });

      navigate(`/prescriptions/${id}`);
    },

    onError: (err) => {
      const responseData = err.response?.data;

      if (responseData) {
        setError(JSON.stringify(responseData));
      } else {
        setError("Failed to update prescription.");
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
    setError("");

    updateMutation.mutate({
      instructions: formData.instructions,
      status: formData.status,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">
          Loading prescription...
        </p>
      </div>
    );
  }

  if (isError || !prescription) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load prescription.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/prescriptions/${id}`)}
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Prescription
          </h1>

          <p className="text-sm text-gray-500">
            Update prescription #{prescription.id}.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Patient
            </label>

            <input
              type="text"
              value={
                prescription.patient_name ||
                `Patient #${prescription.patient_id}`
              }
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Doctor
            </label>

            <input
              type="text"
              value={
                prescription.doctor_name ||
                `Doctor #${prescription.doctor_id}`
              }
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />
          </div>

          {/* Medical Record */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Medical Record
            </label>

            <input
              type="text"
              value={`Medical Record #${prescription.medical_record_id}`}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Instructions */}
          <div>
            <label
              htmlFor="instructions"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Instructions
            </label>

            <textarea
              id="instructions"
              name="instructions"
              rows="4"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Enter prescription instructions"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPrescription;