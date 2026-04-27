import { api } from "./api";

function unwrapList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export async function listSuppliers(params = {}) {
  const response = await api.get("/suppliers", { params });
  return unwrapList(response.data?.data);
}

export async function getSupplier(id) {
  const response = await api.get(`/suppliers/${id}`);
  return response.data?.data || null;
}

export async function createSupplier(payload) {
  const response = await api.post("/suppliers", payload);
  return response.data?.data;
}

export async function updateSupplier(id, payload) {
  const response = await api.put(`/suppliers/${id}`, payload);
  return response.data?.data;
}

export async function deleteSupplier(id) {
  await api.delete(`/suppliers/${id}`);
  return true;
}
