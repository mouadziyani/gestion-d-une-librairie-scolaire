import { useEffect, useState } from "react";
import { AuthContext } from "@/features/auth/authContext";
import * as authServices from "@/features/auth/services/authService";
import { api } from "@/shared/services/api";

const AUTH_USER_KEY = "auth_user";

function readCachedUser() {
  try {
    const cached = localStorage.getItem(AUTH_USER_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function storeCachedUser(user) {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(AUTH_USER_KEY);
}

function readAuthPayload(response) {
  const payload = response?.data ?? response ?? {};
  const data = payload?.data ?? payload;

  return {
    user: data?.user ?? null,
    token: data?.token ?? null,
  };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("token");
    const cachedUser = readCachedUser();
    const hasCachedRole = Boolean(cachedUser?.role?.slug);
    return Boolean(token && !hasCachedRole);
  });

  async function me() {
    const res = await api.get("/me");
    const currentUser = res.data?.data?.user ?? null;

    setUser(currentUser);
    storeCachedUser(currentUser);
    return currentUser;
  }

  async function updateProfile(data) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    if (isFormData && !data.has("_method")) {
      data.append("_method", "PUT");
    }

    const res = isFormData ? await api.post("/profile", data) : await api.put("/profile", data);
    const updatedUser = res.data?.data?.user ?? null;

    setUser(updatedUser);
    storeCachedUser(updatedUser);
    return res.data;
  }

  async function register(form) {
    try {
      const res = await authServices.registerUser(form);
      const { user: nextUser, token } = readAuthPayload(res);

      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(nextUser);
      storeCachedUser(nextUser);

      return res;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async function login(form) {
    try {
      const res = await authServices.loginUser(form);
      const { user: nextUser, token } = readAuthPayload(res);

      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(nextUser);
      storeCachedUser(nextUser);

      return res;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async function logout() {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      storeCachedUser(null);
    }
  }

  async function deleteProfile() {
    try {
      await api.delete("/profile");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      storeCachedUser(null);
    }
  }

  useEffect(() => {
    function handleUnauthenticated() {
      localStorage.removeItem("token");
      setUser(null);
      storeCachedUser(null);
      setLoading(false);
    }

    window.addEventListener("auth:unauthenticated", handleUnauthenticated);

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return () => {
        window.removeEventListener("auth:unauthenticated", handleUnauthenticated);
      };
    }

    const cachedUser = readCachedUser();

    if (cachedUser?.role?.slug) {
      setUser(cachedUser);
      setLoading(false);
    } else if (cachedUser) {
      setUser(cachedUser);
      setLoading(true);
    }

    me()
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        storeCachedUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      window.removeEventListener("auth:unauthenticated", handleUnauthenticated);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, deleteProfile, me, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
