import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { registerPatient } from "../../services/patientService";

const CreatePatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    phone: "",
    address: "",
    emergency_contact: "",
  });

  const [formError, setFormError] = useState("");

  const mutation = useMutation({
    mutationFn: registerPatient,

    onSuccess: () => {
      navigate("/patients");
    },

    onError: (error) => {
      const data = error?.response?.data;

      if (typeof data === "object" && data !== null) {
        const messages = Object.entries(data)
          .map(([field, message]) => {
            const value = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${value}`;
          })
          .join(" | ");

        setFormError(
          messages || "Unable to register patient."
        );
      } else {
        setFormError(
          "Unable to register patient. Please try again."
        );
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    mutation.mutate({
      ...formData,
      date_of_birth: formData.date_of_birth || null,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Register Patient
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a patient account and profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Account Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800">
            Account Information
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <FormField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Personal Information */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Blood Group
              </label>

              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <FormField
              label="Emergency Contact"
              name="emergency_contact"
              type="tel"
              value={formData.emergency_contact}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Address */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Contact Information
          </h2>

          <div className="mt-4">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Patient address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/patients"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
                Registering...
              </>
            ) : (
              <>
                <Save size={17} />
                Register Patient
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
};

export default CreatePatient;