import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  createPrescription,
  getPrescriptions,
} from "../../services/prescriptionService";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { getAppointments } from "../../services/appointmentService";
import { getMedicalRecords } from "../../services/medicalRecordService";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    medical_record_id: "",
    instructions: "",
    status: "ACTIVE",
  });

  const [formError, setFormError] = useState("");

  // Fetch patients
  const {
    data: patients,
    isLoading: patientsLoading,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  // Fetch doctors
  const {
    data: doctors,
    isLoading: doctorsLoading,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  // Fetch appointments
  const {
    data: appointments,
    isLoading: appointmentsLoading,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  // Fetch medical records
  const {
    data: medicalRecords,
    isLoading: medicalRecordsLoading,
  } = useQuery({
    queryKey: ["medical-records"],
    queryFn: getMedicalRecords,
  });

  // Convert possible API response formats into arrays.
  const patientsList = Array.isArray(patients)
    ? patients
    : patients?.results || [];

  const doctorsList = Array.isArray(doctors)
    ? doctors
    : doctors?.results || [];

  const appointmentsList = Array.isArray(appointments)
    ? appointments
    : appointments?.results || [];

  const medicalRecordsList = Array.isArray(medicalRecords)
    ? medicalRecords
    : medicalRecords?.results || [];

  /*
   * Find the logged-in doctor's profile.
   *
   * /users/me/ gives:
   * username = "testdoctor"
   *
   * /doctors/ gives:
   * username = "testdoctor"
   * id = 1
   *
   * Therefore username is the correct field to match.
   */
  const currentDoctor = useMemo(() => {
    if (user?.role !== "DOCTOR") {
      return null;
    }

    return doctorsList.find(
      (doctor) => doctor.username === user.username
    );
  }, [doctorsList, user]);

  // Build the doctor's full name.
  const currentDoctorName = useMemo(() => {
    if (!currentDoctor) {
      return "";
    }

    const fullName = `${currentDoctor.first_name || ""} ${
      currentDoctor.last_name || ""
    }`.trim();

    return fullName || currentDoctor.username;
  }, [currentDoctor]);

  /*
   * Find patients who have appointments with the logged-in doctor.
   *
   * The current appointment API returns doctor_name and patient_name,
   * but does not return doctor_id or patient_id.
   */
  const doctorAppointments = useMemo(() => {
    if (user?.role !== "DOCTOR" || !currentDoctorName) {
      return [];
    }

    return appointmentsList.filter(
      (appointment) =>
        appointment.doctor_name === currentDoctorName &&
        (appointment.status === "SCHEDULED" ||
          appointment.status === "COMPLETED")
    );
  }, [
    appointmentsList,
    currentDoctorName,
    user,
  ]);

  // Get unique patient names from the doctor's appointments.
  const appointmentPatientNames = useMemo(() => {
    return [
      ...new Set(
        doctorAppointments
          .map((appointment) => appointment.patient_name)
          .filter(Boolean)
      ),
    ];
  }, [doctorAppointments]);

  // Return a patient's display name.
  const getPatientName = (patient) => {
    const fullName = `${patient.first_name || ""} ${
      patient.last_name || ""
    }`.trim();

    return fullName || patient.username;
  };

  /*
   * Match appointment patient names with real patient records.
   *
   * The patient records contain the actual patient ID which we need
   * when sending the prescription to the backend.
   */
  const availablePatients = useMemo(() => {
    if (user?.role !== "DOCTOR") {
      return patientsList;
    }

    return patientsList.filter((patient) =>
      appointmentPatientNames.includes(getPatientName(patient))
    );
  }, [
    patientsList,
    appointmentPatientNames,
    user,
  ]);

  // Get medical records belonging to the selected patient.
  const availableMedicalRecords = useMemo(() => {
    if (!formData.patient_id) {
      return [];
    }

    return medicalRecordsList.filter(
      (record) =>
        String(record.patient_id) === String(formData.patient_id)
    );
  }, [
    medicalRecordsList,
    formData.patient_id,
  ]);

  const createMutation = useMutation({
    mutationFn: createPrescription,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["prescriptions"],
      });

      navigate(`/prescriptions/${data.id}`);
    },

    onError: (error) => {
      const responseData = error?.response?.data;

      if (typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .map(([field, message]) => {
            const formattedMessage = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${formattedMessage}`;
          })
          .join(" | ");

        setFormError(
          messages || "Failed to create prescription."
        );
      } else {
        setFormError("Failed to create prescription.");
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,

      // Changing patient means the old medical record
      // should no longer remain selected.
      ...(name === "patient_id"
        ? { medical_record_id: "" }
        : {}),
    }));

    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (user?.role === "DOCTOR" && !currentDoctor) {
      setFormError(
        "Unable to find your doctor profile. Please try again."
      );
      return;
    }

    if (!formData.patient_id) {
      setFormError("Please select a patient.");
      return;
    }

    if (!formData.medical_record_id) {
      setFormError("Please select a medical record.");
      return;
    }

    const payload = {
        patient_id: Number(formData.patient_id),
        doctor_id:
            user?.role === "DOCTOR"
            ? Number(currentDoctor.id)
            : Number(formData.doctor_id),
        medical_record_id: Number(formData.medical_record_id),
        instructions: formData.instructions,
        status: formData.status,
        };

    createMutation.mutate(payload);
  };

  const isLoading =
    patientsLoading ||
    doctorsLoading ||
    appointmentsLoading ||
    medicalRecordsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <p className="text-gray-500">
          Loading prescription form...
        </p>
      </div>
    );
  }

  if (user?.role === "DOCTOR" && !currentDoctor) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />

          <p>
            Unable to find your doctor profile.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/prescriptions")}
          className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          Back to Prescriptions
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/prescriptions")}
          className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            New Prescription
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a prescription for a patient.
          </p>
        </div>
      </div>

      {/* Error */}
      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {formError}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Doctor */}
        <div>
          <label
            htmlFor="doctor_id"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Doctor
          </label>

          {user?.role === "DOCTOR" ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {currentDoctorName}
            </div>
          ) : (
            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select doctor
              </option>

              {doctorsList.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  {`${doctor.first_name || ""} ${
                    doctor.last_name || ""
                  }`.trim() || doctor.username}
                </option>
              ))}
            </select>
          )}
        </div>

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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select patient
            </option>

            {availablePatients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {getPatientName(patient)}
              </option>
            ))}
          </select>

          {user?.role === "DOCTOR" &&
            availablePatients.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No patients with eligible appointments were found
                for this doctor.
              </p>
            )}
        </div>

        {/* Medical Record */}
        <div>
          <label
            htmlFor="medical_record_id"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Medical Record
          </label>

          <select
            id="medical_record_id"
            name="medical_record_id"
            value={formData.medical_record_id}
            onChange={handleChange}
            disabled={!formData.patient_id}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              {formData.patient_id
                ? "Select medical record"
                : "Select a patient first"}
            </option>

            {availableMedicalRecords.map((record) => (
              <option
                key={record.id}
                value={record.id}
              >
                #{record.id} -{" "}
                {record.diagnosis || "Medical Record"}
              </option>
            ))}
          </select>

          {formData.patient_id &&
            availableMedicalRecords.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No medical records found for this patient.
              </p>
            )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ACTIVE">
              Active
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>

        {/* Instructions */}
        <div>
          <label
            htmlFor="instructions"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Instructions
          </label>

          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={5}
            placeholder="Enter prescription instructions..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
          <button
            type="button"
            onClick={() => navigate("/prescriptions")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {createMutation.isPending
              ? "Creating..."
              : "Create Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePrescription;