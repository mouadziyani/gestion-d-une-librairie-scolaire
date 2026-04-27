import { api } from "@/shared/services/api";

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data?.data ?? [];
}

export async function getAdminUser(id) {
  const response = await api.get(`/admin/users/${id}`);
  return response.data?.data ?? null;
}

export async function createAdminUser(payload) {
  const response = await api.post("/admin/users", payload);
  return response.data?.data ?? null;
}

export async function updateAdminUser(id, payload) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  if (isFormData && !payload.has("_method")) {
    payload.append("_method", "PUT");
  }

  const response = isFormData
    ? await api.post(`/admin/users/${id}`, payload)
    : await api.put(`/admin/users/${id}`, payload);
  return response.data?.data ?? null;
}

export async function deleteAdminUser(id) {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data?.data ?? null;
}
