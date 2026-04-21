import axios from "axios";

function normalizeApiBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

const defaultApiBaseUrl = import.meta.env.DEV
  ? "http://localhost:8000/api"
  : `${window.location.origin}/api`;

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
    }

    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("auth_user");
            window.dispatchEvent(new Event("auth:unauthenticated"));
        }

        return Promise.reject(error);
    }
);
