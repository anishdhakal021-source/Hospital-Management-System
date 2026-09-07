import apiClient from "../api/apiClient";

export const getDepartments = async () => {
  const response = await apiClient.get("/departments/");
  return response.data;
};

export const getDepartment = async (departmentId) => {
  const response = await apiClient.get(`/departments/${departmentId}/`);
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await apiClient.post(
    "/departments/",
    departmentData
  );

  return response.data;
};

export const updateDepartment = async (departmentId, departmentData) => {
  const response = await apiClient.patch(
    `/departments/${departmentId}/`,
    departmentData
  );

  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await apiClient.delete(
    `/departments/${departmentId}/`
  );

  return response.data;
};

