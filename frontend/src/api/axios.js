import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^|;\\s*)"+name+"=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
};

api.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export default api;
