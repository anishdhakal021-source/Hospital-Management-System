import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMedicineBatches,
  getMedicines,
  updateMedicineBatch,
} from "../../services/medicineService";

import { useAuth } from "../../context/AuthContext";

const EditMedicineBatch = () => {
  const { id } = useParams();
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

  const canEditBatch =
    user?.role === "ADMIN" || user?.role === "PHARMACIST";

  const {
    data: batches = [],
    isLoading: batchesLoading,
    isError: batchesError,
  } = useQuery({
    queryKey: ["medicine-batches"],
    queryFn: getMedicineBatches,
  });

  const {
    data: medicines = [],
    isLoading: medicinesLoading,
    isError: medicinesError,
  } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const batch = batches.find(
    (item) => Number(item.id) === Number(id)
  );

  useEffect(() => {
    if (batch) {
      setFormData({
        medicine: batch.medicine ?? "",
        batch_number: batch.batch_number ?? "",
        expiry_date: batch.expiry_date ?? "",
        quantity: batch.quantity ?? "",
        purchase_price: batch.purchase_price ?? "",
        selling_price: batch.selling_price ?? "",
      });
    }
  }, [batch]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateMedicineBatch(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicine-batches"],
      });

      navigate("/medicine-batches");
    },

    onError: (error) => {
      console.log(
        "Medicine batch update error:",
        error.response?.data
      );

      setFormError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Unable to update medicine batch."
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

    updateMutation.mutate({
      medicine: Number(formData.medicine),
      batch_number: formData.batch_number,
      expiry_date: formData.expiry_date,
      quantity: Number(formData.quantity),
      purchase_price: formData.purchase_price,
      selling_price: formData.selling_price,
    });
  };

  if (!canEditBatch) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          You are not authorized to edit medicine batches.
        </p>
      </div>
    );
  }

  if (batchesLoading || medicinesLoading) {
    return (
      <div className="p-6">
        Loading batch...
      </div>
    );
  }

  if (batchesError || medicinesError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load medicine batch.
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="p-6 text-red-600">
        Medicine batch not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Edit Medicine Batch
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
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select medicine</option>

            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.name}
              </option>
            ))}
          </select>
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
            disabled={updateMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending
              ? "Updating..."
              : "Update Batch"}
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

export default EditMedicineBatch;