// api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // Your API base URL
  timeout: 5000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
