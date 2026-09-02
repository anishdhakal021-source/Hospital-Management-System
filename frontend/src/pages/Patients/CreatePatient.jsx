import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  createPatient,
  getUsers,
} from "../../services/patientService";

const CreatePatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    blood_group: "",
    emergency_contact: "",
  });

  const [formError, setFormError] = useState("");

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const patientUsers = users.filter(
    (user) => user.role === "PATIENT"
  );

  const mutation = useMutation({
    mutationFn: createPatient,

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
          messages || "Unable to create patient."
        );
      } else {
        setFormError(
          "Unable to create patient. Please try again."
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

    if (!formData.user_id) {
      setFormError("Please select a patient user.");
      return;
    }

    mutation.mutate({
      user_id: Number(formData.user_id),
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      blood_group: formData.blood_group,
      emergency_contact: formData.emergency_contact,
    });
  };

  if (usersLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-slate-600"
            size={28}
          />
          <p className="mt-3 text-gray-600">
            Loading patient users...
          </p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load patient users
        </h2>

        <p className="mt-2 text-sm text-red-600">
          You may not have permission to access the user list.
        </p>

        <Link
          to="/patients"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Add Patient
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a patient profile for an existing patient user.
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
            htmlFor="user_id"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Patient User *
          </label>

          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            required
          >
            <option value="">
              Select patient user
            </option>

            {patientUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
                {user.email ? ` — ${user.email}` : ""}
              </option>
            ))}
          </select>

          {patientUsers.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No PATIENT users are available.
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date_of_birth"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>

            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>

            <select
              id="gender"
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
            <label
              htmlFor="blood_group"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Blood Group
            </label>

            <select
              id="blood_group"
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

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div>
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

        <div>
          <label
            htmlFor="emergency_contact"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Emergency Contact
          </label>

          <input
            id="emergency_contact"
            name="emergency_contact"
            type="tel"
            value={formData.emergency_contact}
            onChange={handleChange}
            placeholder="Emergency contact number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Link
            to="/patients"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              mutation.isPending ||
              patientUsers.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Patient
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatient;