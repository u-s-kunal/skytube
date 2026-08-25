import { useEffect, useState } from "react";
import {
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
} from "../api/auth.api.js";

import { AuthContext } from "./AuthContext.jsx";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkUser = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      // No access token at all
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try existing access token
        const response = await getCurrentUser(token);

        setUser(response.data);
        setAccessToken(token);

        return;
      } catch (error) {
        console.log(
         `${error}..Error Accesing user`
        );
      }

      // Access token failed → refresh it
      const refreshResponse = await refreshAccessToken();

      token = refreshResponse.data.accessToken;

      localStorage.setItem("accessToken", token);

      // Get user using new access token
      const userResponse = await getCurrentUser(token);

      setUser(userResponse.data);
      setAccessToken(token);
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error,
      );

      localStorage.removeItem("accessToken");

      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  checkUser();
}, []);

  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);

    setUser(userData);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await logoutUser(accessToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");

      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}