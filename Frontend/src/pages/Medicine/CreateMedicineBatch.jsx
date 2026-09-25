import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  createMedicineBatch,
  getMedicines,
} from "../../services/medicineService";
import { useAuth } from "../../context/AuthContext";

const CreateMedicineBatch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    medicine: "",
    batch_number: "",
    expiry_date: "",
    quantity: "",
    purchase_price: "",
    selling_price: "",
  });

  const [formError, setFormError] = useState("");

  const canCreateBatch =
    user?.role === "ADMIN" || user?.role === "PHARMACIST";

  const {
    data: medicines = [],
    isLoading: medicinesLoading,
    isError: medicinesError,
  } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const createMutation = useMutation({
    mutationFn: createMedicineBatch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicine-batches"],
      });

      navigate("/medicine-batches");
    },

    onError: (error) => {
      console.log(
        "Medicine batch creation error:",
        error.response?.data
      );

      setFormError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Unable to create medicine batch."
      );
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

    createMutation.mutate({
      medicine: Number(formData.medicine),
      batch_number: formData.batch_number,
      expiry_date: formData.expiry_date,
      quantity: Number(formData.quantity),
      purchase_price: formData.purchase_price,
      selling_price: formData.selling_price,
    });
  };

  if (!canCreateBatch) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          You are not authorized to create medicine batches.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Add Medicine Batch
      </h1>

      {formError && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow"
      >
        {/* Medicine */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Medicine
          </label>

          <select
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
            required
            disabled={medicinesLoading}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">
              {medicinesLoading
                ? "Loading medicines..."
                : "Select medicine"}
            </option>

            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.name}
              </option>
            ))}
          </select>

          {medicinesError && (
            <p className="mt-1 text-sm text-red-600">
              Failed to load medicines.
            </p>
          )}
        </div>

        {/* Batch Number */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Batch Number
          </label>

          <input
            type="text"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2"
            placeholder="e.g. BATCH-001"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Expiry Date
          </label>

          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Quantity
          </label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Purchase Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Purchase Price
          </label>

          <input
            type="number"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Selling Price
          </label>

          <input
            type="number"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending
              ? "Creating..."
              : "Create Batch"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/medicine-batches")}
            className="rounded-lg border px-5 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicineBatch;