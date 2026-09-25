import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createMedicine } from "../../services/medicineService";

const CreateMedicine = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    category: "",
    manufacturer: "",
    description: "",
    is_active: true,
  });

  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createMedicine,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicines"],
      });

      navigate("/medicines");
    },

    onError: (error) => {
      console.log(
        "Medicine creation error:",
        error.response?.data
      );

      setFormError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Unable to create the medicine."
      );
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Medicine name is required.");
      return;
    }

    createMutation.mutate({
      name: formData.name.trim(),
      generic_name: formData.generic_name.trim(),
      category: formData.category.trim(),
      manufacturer: formData.manufacturer.trim(),
      description: formData.description.trim(),
      is_active: formData.is_active,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/medicines")}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Medicine
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new medicine to the hospital pharmacy.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Medicine name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Medicine Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Generic name */}
          <div>
            <label
              htmlFor="generic_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Generic Name
            </label>

            <input
              id="generic_name"
              name="generic_name"
              type="text"
              value={formData.generic_name}
              onChange={handleChange}
              placeholder="e.g. Acetaminophen"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category + Manufacturer */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Painkiller"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="manufacturer"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Manufacturer
              </label>

              <input
                id="manufacturer"
                name="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g. ABC Pharma"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter medicine description..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Active status */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-sm text-gray-700">
              Medicine is active
            </span>
          </label>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/medicines")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {createMutation.isPending
                ? "Saving..."
                : "Save Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMedicine;