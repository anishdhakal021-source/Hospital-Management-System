import apiClient from "../api/apiClient";

// Get all medicines
export const getMedicines = async () => {
  const response = await apiClient.get("/medicines/");
  return response.data;
};