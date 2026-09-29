import apiClient from "../api/apiClient";

// Get all users.
// The backend allows this endpoint only for ADMIN users.
export const getUsers = async () => {
  const response = await apiClient.get("/users/");
  return response.data;
};

export const createUser = async (userData) => {
    const response = await apiClient.post("/users/", userData);
    return response.data;
  };

// Get a single user. The backend allows this endpoint only for ADMIN users.
export const getUser = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiClient.patch(`/users/${userId}/`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}/`);
  return response.data;
};
