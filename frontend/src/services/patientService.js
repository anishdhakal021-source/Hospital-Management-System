import apiClient from "../api/apiClient";

export const getPatients = async () => {
  const response = await apiClient.get("/patients/");
  return response.data;
};

export const getPatient = async (patientId) => {
  const response = await apiClient.get(`/patients/${patientId}/`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await apiClient.post("/patients/", patientData);
  return response.data;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await apiClient.patch(
    `/patients/${patientId}/`,
    patientData
  );
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get("/users/");
  return response.data;
};