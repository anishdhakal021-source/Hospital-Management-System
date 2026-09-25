import apiClient from "../api/apiClient";

// Get all medicines
export const getMedicines = async () => {
  const response = await apiClient.get("/medicines/");
  return response.data;
};

// Create a medicine
export const createMedicine = async (medicineData) => {
  const response = await apiClient.post("/medicines/", medicineData);
  return response.data;
};

// Update a medicine
export const updateMedicine = async (medicineId, medicineData) => {
  const response = await apiClient.patch(
    `/medicines/${medicineId}/`,
    medicineData
  );

  return response.data;
};

// Delete a medicine
export const deleteMedicine = async(medicineId)=>{
  const response = await apiClient.delete(
    `/medicines/${medicineId}/`
  );

  return response.data;
};


// Get all medicine batches
export const getMedicineBatches = async () => {
  const response = await apiClient.get("/medicines/batches/");
  return response.data;
};

// Create a medicine batch
export const createMedicineBatch = async (batchData) => {
  const response = await apiClient.post(
    "/medicines/batches/",
    batchData
  );
  return response.data;
};

// Update a medicine batch
export const updateMedicineBatch = async (batchId, batchData) => {
  const response = await apiClient.patch(
    `/medicines/batches/${batchId}/`,
    batchData
  );
  return response.data;
};

// Delete a medicine batch
export const deleteMedicineBatch = async (batchId) => {
  const response = await apiClient.delete(
    `/medicines/batches/${batchId}/`
  );
  return response.data;
};