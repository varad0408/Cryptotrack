// src/services/api.js
import axios from "axios";

const api = axios.create({
  // NOTE: no /api here — keep it just the origin
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
