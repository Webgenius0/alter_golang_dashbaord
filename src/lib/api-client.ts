import axios from "axios";

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5525/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5525/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiPrivate.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
