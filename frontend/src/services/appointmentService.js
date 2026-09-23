import apiClient from "../api/apiClient";

export const getAppointments = async () => {
  const response = await apiClient.get("/appointments/");
  return response.data;
};

export const getAppointment = async (appointmentId) => {
  const response = await apiClient.get(
    `/appointments/${appointmentId}/`
  );
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await apiClient.post(
    "/appointments/",
    appointmentData
  );
  return response.data;
};

export const updateAppointment = async (
  appointmentId,
  appointmentData
) => {
  const response = await apiClient.patch(
    `/appointments/${appointmentId}/`,
    appointmentData
  );
  return response.data;
};

export const deleteAppointment = async (appointmentId) => {
  const response = await apiClient.delete(
    `/appointments/${appointmentId}/`
  );
  return response.data;
};