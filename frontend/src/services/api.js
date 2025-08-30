// src/services/api.js
import axios from "axios";

const api = axios.create({
  // Add `/api` so all routes are prefixed correctly
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
