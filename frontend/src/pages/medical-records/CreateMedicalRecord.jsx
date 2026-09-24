import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getPatients } from "../../services/patientService";
import { createMedicalRecord } from "../../services/medicalRecordService";
import { getDoctors } from "../../services/doctorService";
import { getAppointments } from "../../services/appointmentService";

const CreateMedicalRecord = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patient_id: "",
    diagnosis: "",
    symptoms: "",
    notes: "",
  });

  const [formError, setFormError] = useState("");

  // Load patients.
  const {
    data: patients = [],
    isLoading: patientsLoading,
    isError: patientsError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  // Load doctors so we can find the logged-in doctor's profile.
  const {
    data: doctors = [],
    isLoading: doctorsLoading,
    isError: doctorsError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  // Load appointments for filtering the doctor's patients.
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    isError: appointmentsError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  /*
   * Find the Doctor profile belonging to the currently
   * logged-in user.
   */
  const currentDoctor = doctors.find(
    (doctor) => doctor.username === user?.username
  );

  /*
   * Get the doctor's name from the doctor profile.
   * This is used to identify the doctor's appointments.
   */
  const currentDoctorName = currentDoctor
    ? `${currentDoctor.first_name} ${currentDoctor.last_name}`.trim()
    : "";

  /*
   * Get patients who have appointments with the logged-in doctor.
   *
   * We only consider SCHEDULED and COMPLETED appointments
   * because these represent actual doctor-patient interactions.
   */
  const doctorAppointmentPatientNames = new Set(
    appointments
      .filter(
        (appointment) =>
          appointment.doctor_name === currentDoctorName &&
          ["SCHEDULED", "COMPLETED"].includes(appointment.status)
      )
      .map((appointment) => appointment.patient_name)
      .filter(Boolean)
  );

  /*
   * Filter the patient list so doctors only see patients
   * who have appointments with them.
   */
  const availablePatients =
    user?.role === "DOCTOR"
      ? patients.filter((patient) => {
          const patientName =
            patient.user_name ||
            `${patient.first_name} ${patient.last_name}`.trim() ||
            patient.name ||
            `Patient #${patient.id}`;

          return doctorAppointmentPatientNames.has(patientName);
        })
      : patients;

  const createMutation = useMutation({
    mutationFn: createMedicalRecord,

    onSuccess: () => {
      // Refresh the medical-record list after successful creation.
      queryClient.invalidateQueries({
        queryKey: ["medical-records"],
      });

      navigate("/medical-records");
    },

    onError: (error) => {
      console.log(
        "Medical record creation error:",
        error.response?.data
      );

      setFormError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Unable to create the medical record. Please check the form."
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

    if (!formData.patient_id) {
      setFormError("Please select a patient.");
      return;
    }

    if (!formData.diagnosis.trim()) {
      setFormError("Diagnosis is required.");
      return;
    }

    /*
     * For doctors, automatically use the logged-in doctor's ID.
     *
     * For other roles, doctor_id is not automatically added here.
     * The backend can continue to enforce the appropriate rules.
     */
    const payload = {
      patient_id: Number(formData.patient_id),
      diagnosis: formData.diagnosis.trim(),
      symptoms: formData.symptoms.trim(),
      notes: formData.notes.trim(),
    };

    if (user?.role === "DOCTOR") {
      if (!currentDoctor?.id) {
        setFormError(
          "Unable to identify your doctor profile. Please contact the administrator."
        );
        return;
      }

      payload.doctor_id = Number(currentDoctor.id);
    }

    createMutation.mutate(payload);
  };

  const isLoadingPatients =
    patientsLoading ||
    (user?.role === "DOCTOR" &&
      (doctorsLoading || appointmentsLoading));

  const hasLoadingError =
    patientsError ||
    (user?.role === "DOCTOR" &&
      (doctorsError || appointmentsError));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/medical-records")}
          className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
          aria-label="Back to medical records"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Medical Record
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new medical record for a patient.
          </p>
        </div>
      </div>

      {/* Error */}
      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Patient loading error */}
      {hasLoadingError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load the required data. Please refresh the page and try
          again.
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        {/* Patient */}
        <div>
          <label
            htmlFor="patient_id"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Patient
          </label>

          <select
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            disabled={isLoadingPatients || createMutation.isPending}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingPatients
                ? "Loading patients..."
                : "Select a patient"}
            </option>

            {availablePatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.user_name ||
                  `${patient.first_name} ${patient.last_name}`.trim() ||
                  patient.name ||
                  `Patient #${patient.id}`}
              </option>
            ))}
          </select>

          {/* Helpful message for doctors with no matching appointments */}
          {user?.role === "DOCTOR" &&
            !isLoadingPatients &&
            availablePatients.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No patients with scheduled or completed appointments were
                found for you.
              </p>
            )}
        </div>

        {/* Diagnosis */}
        <div>
          <label
            htmlFor="diagnosis"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Diagnosis
          </label>

          <input
            id="diagnosis"
            name="diagnosis"
            type="text"
            value={formData.diagnosis}
            onChange={handleChange}
            disabled={createMutation.isPending}
            placeholder="Enter diagnosis"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label
            htmlFor="symptoms"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Symptoms
          </label>

          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            disabled={createMutation.isPending}
            rows={4}
            placeholder="Describe the patient's symptoms"
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={createMutation.isPending}
            rows={4}
            placeholder="Additional medical notes"
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/medical-records")}
            disabled={createMutation.isPending}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              (user?.role === "DOCTOR" && availablePatients.length === 0)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {createMutation.isPending
              ? "Creating..."
              : "Create Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMedicalRecord;