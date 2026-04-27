import axios from "axios";

function normalizeApiBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

function sameOriginApiBaseUrl() {
  return `${window.location.origin}/api`;
}

function resolveApiBaseUrl(url) {
  const configuredUrl = normalizeApiBaseUrl(url);
  const defaultApiBaseUrl = import.meta.env.DEV
    ? "http://3.126.51.205/api"
    : sameOriginApiBaseUrl();

  const candidateUrl = configuredUrl || defaultApiBaseUrl;

  if (window.location.protocol === "https:" && candidateUrl.startsWith("http://")) {
    return sameOriginApiBaseUrl();
  }

  if (candidateUrl.startsWith("/")) {
    return `${window.location.origin}${candidateUrl}`;
  }

  return candidateUrl;
}

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

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
