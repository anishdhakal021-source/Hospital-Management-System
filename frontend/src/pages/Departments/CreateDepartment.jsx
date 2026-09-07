import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createDepartment } from "../../services/departmentService";

const CreateDepartment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formError, setFormError] = useState("");

  const mutation = useMutation({
    mutationFn: createDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      navigate("/departments");
    },

    onError: (error) => {
      const data = error?.response?.data;

      if (data?.name) {
        setFormError(
          Array.isArray(data.name)
            ? data.name[0]
            : data.name
        );
        return;
      }

      setFormError(
        data?.detail ||
          "Failed to create department. Please try again."
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

    if (!formData.name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Add Department
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new hospital department.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Department Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Cardiology"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={mutation.isPending}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the department..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={mutation.isPending}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/departments")}
            disabled={mutation.isPending}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending
              ? "Creating..."
              : "Create Department"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDepartment;