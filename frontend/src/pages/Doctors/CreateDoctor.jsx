import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";

import { registerDoctor } from "../../services/doctorService";
import { getDepartments } from "../../services/departmentService";

const CreateDoctor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    department_id: "",
    specialization: "",
    license_number: "",
    phone: "",
    consultation_fee: "",
    is_available: true,
  });

  const [formError, setFormError] = useState("");

  const {
    data: departments,
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const registerMutation = useMutation({
    mutationFn: registerDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctors"],
      });

      navigate("/doctors");
    },
    onError: (error) => {
      const responseData = error.response?.data;

      if (responseData) {
        const messages = Object.entries(responseData)
          .map(([field, errors]) => {
            const errorMessages = Array.isArray(errors)
              ? errors.join(", ")
              : String(errors);

            return `${field}: ${errorMessages}`;
          })
          .join(" | ");

        setFormError(messages);
      } else {
        setFormError(
          "Unable to register doctor. Please try again."
        );
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
    setFormError("");

    if (!formData.username.trim()) {
      setFormError("Username is required.");
      return;
    }

    if (!formData.password) {
      setFormError("Password is required.");
      return;
    }

    if (!formData.department_id) {
      setFormError("Please select a department.");
      return;
    }

    if (!formData.specialization.trim()) {
      setFormError("Specialization is required.");
      return;
    }

    if (!formData.license_number.trim()) {
      setFormError("License number is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    if (!formData.consultation_fee) {
      setFormError("Consultation fee is required.");
      return;
    }

    const payload = {
      ...formData,
      department_id: Number(formData.department_id),
      consultation_fee: formData.consultation_fee,
    };

    registerMutation.mutate(payload);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/doctors")}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Back to doctors"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Register Doctor
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Create a doctor account and profile.
          </p>
        </div>
      </div>

      {formError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {departmentsError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load departments. Please refresh the page.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
          <UserPlus size={20} className="text-blue-600" />

          <h2 className="font-semibold text-gray-900">
            Account Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username *
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password *
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mb-6 mt-8 border-b border-gray-200 pb-4">
          <h2 className="font-semibold text-gray-900">
            Professional Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="department_id"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Department *
            </label>

            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              disabled={departmentsLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              required
            >
              <option value="">
                {departmentsLoading
                  ? "Loading departments..."
                  : "Select department"}
              </option>

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

          <div>
            <label
              htmlFor="specialization"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Specialization *
            </label>

            <input
              id="specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="license_number"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              License Number *
            </label>

            <input
              id="license_number"
              name="license_number"
              type="text"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone *
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="consultation_fee"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Consultation Fee *
            </label>

            <input
              id="consultation_fee"
              name="consultation_fee"
              type="number"
              min="0"
              step="0.01"
              value={formData.consultation_fee}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex items-center gap-3 md:pt-7">
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
              Doctor is currently available
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerMutation.isPending
              ? "Registering..."
              : "Register Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDoctor;