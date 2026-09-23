import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getDoctor,
  updateDoctor,
} from "../../services/doctorService";
import { getDepartments } from "../../services/departmentService";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch doctor
  const {
    data: doctor,
    isLoading: doctorLoading,
    isError: doctorError,
  } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctor(id),
  });

  // Fetch departments
  const {
    data: departments,
    isLoading: departmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  // Initialize form when doctor data arrives
  if (doctor && !formData) {
    setFormData({
      department_id: doctor.department_id,
      specialization: doctor.specialization || "",
      license_number: doctor.license_number || "",
      phone: doctor.phone || "",
      consultation_fee: doctor.consultation_fee || "",
      is_available: doctor.is_available,
    });
  }

  const updateMutation = useMutation({
    mutationFn: (data) => updateDoctor(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctors"],
      });

      queryClient.invalidateQueries({
        queryKey: ["doctor", id],
      });

      navigate("/doctors");
    },

    onError: (error) => {
      const data = error.response?.data;

      if (typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, errors]) => {
            const message = Array.isArray(errors)
              ? errors.join(", ")
              : errors;

            return `${field}: ${message}`;
          })
          .join("\n");

        setErrorMessage(messages);
      } else {
        setErrorMessage("Failed to update doctor.");
      }
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
    setErrorMessage("");

    if (!formData.department_id) {
      setErrorMessage("Please select a department.");
      return;
    }

    if (!formData.specialization.trim()) {
      setErrorMessage("Specialization is required.");
      return;
    }

    if (!formData.license_number.trim()) {
      setErrorMessage("License number is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required.");
      return;
    }

    if (!formData.consultation_fee) {
      setErrorMessage("Consultation fee is required.");
      return;
    }

    const payload = {
      department_id: Number(formData.department_id),
      specialization: formData.specialization.trim(),
      license_number: formData.license_number.trim(),
      phone: formData.phone.trim(),
      consultation_fee: formData.consultation_fee,
      is_available: formData.is_available,
    };

    updateMutation.mutate(payload);
  };

  if (doctorLoading || departmentsLoading || !formData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600">Loading doctor...</p>
      </div>
    );
  }

  if (doctorError || !doctor) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">
          Unable to load doctor information.
        </p>

        <button
          type="button"
          onClick={() => navigate("/doctors")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Doctor
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update doctor profile information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/doctors")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Read-only user information */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Doctor Account
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                value={doctor.username || ""}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={doctor.email || ""}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Account information cannot be changed from this page.
          </p>
        </div>

        {/* Doctor profile */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Department */}
          <div>
            <label
              htmlFor="department_id"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <select
              id="department_id"
              name="department_id"
              value={formData.department_id || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select department</option>

              {departments?.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label
              htmlFor="specialization"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Specialization
            </label>

            <input
              id="specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* License */}
          <div>
            <label
              htmlFor="license_number"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              License Number
            </label>

            <input
              id="license_number"
              name="license_number"
              type="text"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Consultation fee */}
          <div>
            <label
              htmlFor="consultation_fee"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Consultation Fee
            </label>

            <input
              id="consultation_fee"
              name="consultation_fee"
              type="number"
              step="0.01"
              min="0"
              value={formData.consultation_fee}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 sm:pt-7">
            <input
              id="is_available"
              name="is_available"
              type="checkbox"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />

            <label
              htmlFor="is_available"
              className="text-sm font-medium text-gray-700"
            >
              Doctor is available
            </label>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mt-6 whitespace-pre-line rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;