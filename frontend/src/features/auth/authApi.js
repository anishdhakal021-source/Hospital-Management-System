import apiClient from "../../api/apiClient";

export const loginUser = async (username, password) => {
  const response = await apiClient.post("/users/login/", {
    username,
    password,
  });

  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post("/users/token/refresh/", {
    refresh: refreshToken,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me/");
  return response.data;
};