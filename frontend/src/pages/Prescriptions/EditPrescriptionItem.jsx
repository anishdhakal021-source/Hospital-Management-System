import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getPrescriptionItem,
  updatePrescriptionItem,
} from "../../services/prescriptionService";

function EditPrescriptionItem() {
  const { id, itemId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["prescription-item", itemId],
    queryFn: () => getPrescriptionItem(itemId),
  });

  // Populate the form when the API data arrives.
  if (item && !formData) {
    setFormData({
      quantity: item.quantity,
      dosage: item.dosage || "",
      frequency: item.frequency || "",
      duration: item.duration || "",
      instructions: item.instructions || "",
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data) => updatePrescriptionItem(itemId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prescription-items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["prescription-item", itemId],
      });

      navigate(`/prescriptions/${id}`);
    },

    onError: (err) => {
      const responseData = err.response?.data;

      if (responseData) {
        setError(JSON.stringify(responseData));
      } else {
        setError("Failed to update medicine.");
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
      quantity: Number(formData.quantity),
      dosage: formData.dosage,
      frequency: formData.frequency,
      duration: formData.duration,
      instructions: formData.instructions,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading medicine...</p>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load prescription medicine.
        </p>
      </div>
    );
  }

  if (!formData) {
    return null;
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
            Edit Medicine
          </h1>

          <p className="text-sm text-gray-500">
            Update the prescription medicine details.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Medicine</p>

          <p className="font-semibold text-gray-800">
            {item.medicine_name || `Medicine #${item.medicine}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="quantity"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="dosage"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Dosage
            </label>

            <input
              id="dosage"
              name="dosage"
              type="text"
              value={formData.dosage}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="frequency"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>

            <input
              id="frequency"
              name="frequency"
              type="text"
              value={formData.frequency}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Duration
            </label>

            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

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
              rows="3"
              value={formData.instructions}
              onChange={handleChange}
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

export default EditPrescriptionItem;