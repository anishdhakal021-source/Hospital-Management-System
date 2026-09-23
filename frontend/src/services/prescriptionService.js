import apiClient from "../api/apiClient";

// Get all prescriptions
export const getPrescriptions = async () => {
  const response = await apiClient.get("/prescriptions/");
  return response.data;
};

// Get one prescription
export const getPrescription = async (prescriptionId) => {
  const response = await apiClient.get(
    `/prescriptions/${prescriptionId}/`
  );
  return response.data;
};

// Create a prescription
export const createPrescription = async (prescriptionData) => {
  const response = await apiClient.post(
    "/prescriptions/",
    prescriptionData
  );
  return response.data;
};

// Update a prescription
export const updatePrescription = async (
  prescriptionId,
  prescriptionData
) => {
  const response = await apiClient.patch(
    `/prescriptions/${prescriptionId}/`,
    prescriptionData
  );
  return response.data;
};

// Delete a prescription
export const deletePrescription = async (prescriptionId) => {
  const response = await apiClient.delete(
    `/prescriptions/${prescriptionId}/`
  );
  return response.data;
};

// Get prescription items
export const getPrescriptionItems = async () => {
  const response = await apiClient.get("/prescriptions/items/");
  return response.data;
};

// Get one prescription item
export const getPrescriptionItem = async (itemId) => {
  const response = await apiClient.get(
    `/prescriptions/items/${itemId}/`
  );
  return response.data;
};

// Create prescription item
export const createPrescriptionItem = async (itemData) => {
  const response = await apiClient.post(
    "/prescriptions/items/",
    itemData
  );
  return response.data;
};

// Update prescription item
export const updatePrescriptionItem = async (itemId, itemData) => {
  const response = await apiClient.patch(
    `/prescriptions/items/${itemId}/`,
    itemData
  );
  return response.data;
};

// Delete prescription item
export const deletePrescriptionItem = async (itemId) => {
  const response = await apiClient.delete(
    `/prescriptions/items/${itemId}/`
  );
  return response.data;
};