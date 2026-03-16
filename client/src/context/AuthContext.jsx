import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenManager } from "../api/tokenManager";
import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log("hiih");
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await apiClient.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        if (response.data?.success) {
          tokenManager.setToken(response.data.accessToken);
          setIsAuthenticated(true);
        } else {
          tokenManager.clearToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        tokenManager.clearToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
