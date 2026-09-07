import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getDoctors } from "../../services/doctorService";
import { getPatients } from "../../services/patientService";
import { createAppointment } from "../../services/appointmentService";

const CreateAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    doctor_id: "",
    appointment_date: "",
    reason: "",
  });

  const [formError, setFormError] = useState("");

  // Get doctors
  const {
    data: doctors = [],
    isLoading: doctorsLoading,
    isError: doctorsError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  // Get patients
  const {
    data: patients = [],
    isLoading: patientsLoading,
    isError: patientsError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  /*
   * Find the patient record belonging to the logged-in user.
   *
   * We use username instead of assuming:
   * patient.id === user.id
   *
   * because Patient ID and User ID are separate database IDs.
   */
  const currentPatient = patients.find(
    (patient) => patient.username === user?.username
  );

  const createMutation = useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      navigate("/appointments");
    },

    onError: (error) => {
      const data = error?.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .flatMap(([field, value]) => {
            const values = Array.isArray(value) ? value : [value];

            return values.map((message) => `${field}: ${message}`);
          })
          .join("\n");

        setFormError(
          messages || "Unable to create the appointment."
        );
      } else {
        setFormError(
          "Unable to create the appointment. Please try again."
        );
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    // Make sure the patient profile was found
    if (!currentPatient) {
      setFormError(
        "Patient profile not found. Please make sure your patient profile exists."
      );
      return;
    }

    if (!formData.doctor_id) {
      setFormError("Please select a doctor.");
      return;
    }

    if (!formData.appointment_date) {
      setFormError(
        "Please select an appointment date and time."
      );
      return;
    }

    /*
     * Send the Patient ID to the backend.
     *
     * The backend will still verify whether this patient
     * is allowed to create the appointment.
     */
    createMutation.mutate({
      patient_id: currentPatient.id,
      doctor_id: Number(formData.doctor_id),
      appointment_date: formData.appointment_date,
      reason: formData.reason,
    });
  };

  // Loading state
  if (doctorsLoading || patientsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading appointment form...
        </div>
      </div>
    );
  }

  // Error loading doctors/patients
  if (doctorsError || patientsError) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Unable to load the appointment form data.
          Please refresh the page and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/appointments")}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          title="Back to appointments"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Appointment
          </h1>

          <p className="text-sm text-gray-500">
            Schedule an appointment with a doctor
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor */}
          <div>
            <label
              htmlFor="doctor_id"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Doctor
            </label>

            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select a doctor
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {doctor.user?.first_name || doctor.username
                    ? `${doctor.user?.first_name || doctor.username} ${
                        doctor.user?.last_name || ""
                      }`.trim()
                    : `Doctor #${doctor.id}`}
                  {doctor.specialization
                    ? ` - ${doctor.specialization}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment date/time */}
          <div>
            <label
              htmlFor="appointment_date"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <CalendarDays className="h-4 w-4" />
              Appointment Date & Time
            </label>

            <input
              id="appointment_date"
              name="appointment_date"
              type="datetime-local"
              value={formData.appointment_date}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Reason
            </label>

            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Enter the reason for the appointment..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Error */}
          {formError && (
            <div className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {formError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createMutation.isPending ||
                !currentPatient
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;