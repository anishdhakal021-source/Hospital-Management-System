import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  createPrescriptionItem,
} from "../../services/prescriptionService";
import { getMedicines } from "../../services/medicineService";

function CreatePrescriptionItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    medicine: "",
    quantity: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const [error, setError] = useState("");

  // Load available medicines from the backend.
  const {
    data: medicines,
    isLoading: isMedicinesLoading,
    isError: isMedicinesError,
  } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const createMutation = useMutation({
    mutationFn: createPrescriptionItem,

    onSuccess: () => {
      // Refresh prescription medicine data after creating an item.
      queryClient.invalidateQueries({
        queryKey: ["prescription-items"],
      });

      navigate(`/prescriptions/${id}`);
    },

    onError: (err) => {
      const responseData = err.response?.data;

      if (responseData) {
        setError(JSON.stringify(responseData));
      } else {
        setError("Failed to add medicine.");
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

    createMutation.mutate({
      prescription: Number(id),
      medicine: Number(formData.medicine),
      quantity: Number(formData.quantity),
      dosage: formData.dosage,
      frequency: formData.frequency,
      duration: formData.duration,
      instructions: formData.instructions,
    });
  };

  if (isMedicinesLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading medicines...</p>
      </div>
    );
  }

  if (isMedicinesError) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Failed to load medicines.
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
            Add Medicine
          </h1>

          <p className="text-sm text-gray-500">
            Add a medicine to this prescription.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Medicine */}
          <div>
            <label
              htmlFor="medicine"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Medicine
            </label>

            <select
              id="medicine"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select medicine</option>

              {Array.isArray(medicines) &&
                medicines
                  .filter((medicine) => medicine.is_active)
                  .map((medicine) => (
                    <option
                      key={medicine.id}
                      value={medicine.id}
                    >
                      {medicine.name}
                      {medicine.generic_name
                        ? ` (${medicine.generic_name})`
                        : ""}
                    </option>
                  ))}
            </select>
          </div>

          {/* Quantity */}
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

          {/* Dosage */}
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
              placeholder="e.g. 500mg"
              value={formData.dosage}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Frequency */}
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
              placeholder="e.g. Twice daily"
              value={formData.frequency}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Duration */}
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
              placeholder="e.g. 5 days"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
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
              rows="3"
              placeholder="e.g. Take after meals"
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
            disabled={createMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {createMutation.isPending
              ? "Adding..."
              : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePrescriptionItem;