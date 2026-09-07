import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDepartment,
  updateDepartment,
} from "../../services/departmentService";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [formError, setFormError] = useState("");

  const {
    data: department,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartment(id),
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        is_active: department.is_active,
      });
    }
  }, [department]);

  const mutation = useMutation({
    mutationFn: (data) => updateDepartment(id, data),

    onSuccess: (updatedDepartment) => {
      queryClient.setQueryData(
        ["department", id],
        updatedDepartment
      );

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
          "Failed to update department. Please try again."
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
      setFormError("Department name is required.");
      return;
    }

    mutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      is_active: formData.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          Loading department...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Failed to load department
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error?.response?.data?.detail ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Department
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update department information.
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
            disabled={mutation.isPending}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={mutation.isPending}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            disabled={mutation.isPending}
            className="h-4 w-4 rounded border-gray-300"
          />

          <span className="text-sm font-medium text-gray-700">
            Department is active
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/departments")}
            disabled={mutation.isPending}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;