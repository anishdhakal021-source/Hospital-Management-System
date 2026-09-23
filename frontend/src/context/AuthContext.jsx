import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  getCurrentUser,
} from "../features/auth/authApi";
import {
  saveAuthData,
  getAccessToken,
  getStoredUser,
  clearAuthData,
} from "../features/auth/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        saveAuthData(
          token,
          localStorage.getItem("refresh_token"),
          currentUser
        );
      } catch (error) {
        clearAuthData();
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (username, password) => {
    const data = await loginUser(username, password);

    saveAuthData(data.access, data.refresh);

    setAccessToken(data.access);

    const currentUserResponse = await getCurrentUser();

    saveAuthData(
      data.access,
      data.refresh,
      currentUserResponse
    );

    setUser(currentUserResponse);

    return currentUserResponse;
  };

  const logout = () => {
    clearAuthData();
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    accessToken,
    user,
    loading,
    isAuthenticated: Boolean(accessToken),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};