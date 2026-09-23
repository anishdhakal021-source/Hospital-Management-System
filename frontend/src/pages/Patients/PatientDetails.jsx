import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Save,
  RefreshCw,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getPatient,
  updatePatient,
} from "../../services/patientService";

const PatientDetails = () => {
  const { id } = useParams();

  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    data: patient,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id),
  });

  const [formData, setFormData] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => updatePatient(id, data),

    onSuccess: () => {
      setEditing(false);
      setFormError("");
      refetch();
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
          messages || "Unable to update patient."
        );
      } else {
        setFormError(
          "Unable to update patient. Please try again."
        );
      }
    },
  });

  const startEditing = () => {
    setFormData({
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      address: patient.address || "",
      blood_group: patient.blood_group || "",
      emergency_contact: patient.emergency_contact || "",
    });

    setFormError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setFormData(null);
    setFormError("");
  };

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

    mutation.mutate({
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      blood_group: formData.blood_group,
      emergency_contact: formData.emergency_contact,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-slate-600"
          />
          <p className="mt-3 text-gray-600">
            Loading patient...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load patient
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading this patient."}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>
    );
  }

  const patientName =
    patient.first_name || patient.last_name
      ? `${patient.first_name || ""} ${
          patient.last_name || ""
        }`.trim()
      : patient.username;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-full bg-slate-100 p-3">
              <User size={24} className="text-slate-700" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {patientName}
              </h1>

              <p className="text-sm text-gray-500">
                @{patient.username}
              </p>
            </div>
          </div>
        </div>

        {!editing && (
          <button
            onClick={startEditing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Edit size={17} />
            Edit Patient
          </button>
        )}
      </div>

      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {formError}
        </div>
      )}

      {!editing ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-800">
              Patient Information
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="Username"
              value={patient.username}
            />

            <InfoItem
              label="Email"
              value={patient.email}
            />

            <InfoItem
              label="Date of Birth"
              value={patient.date_of_birth}
            />

            <InfoItem
              label="Gender"
              value={patient.gender}
            />

            <InfoItem
              label="Blood Group"
              value={patient.blood_group}
            />

            <InfoItem
              label="Phone"
              value={patient.phone}
            />

            <InfoItem
              label="Emergency Contact"
              value={patient.emergency_contact}
            />

            <InfoItem
              label="Address"
              value={patient.address}
            />
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 sm:grid-cols-2">
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
};

const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
};

export default PatientDetails;