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
