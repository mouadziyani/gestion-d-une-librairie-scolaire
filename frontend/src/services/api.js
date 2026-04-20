import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
