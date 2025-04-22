/*eslint-disable*/
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../api/axios"; // Adjust the import based on your project structure
// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (via localStorage token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // You could also fetch user details here if needed
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({ token });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      await api.post("/api/auth/register", { username, email, password });

      // Auto login after successful registration
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
