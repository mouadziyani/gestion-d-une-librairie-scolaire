import { api } from "./api";

export async function getStockOverview(params = {}) {
  const response = await api.get("/stocks", { params });
  return response.data?.data ?? { items: [], stats: {} };
}

export async function getStockHistory(params = {}) {
  const response = await api.get("/stocks/history", { params });
  return response.data?.data ?? [];
}

export async function getStockEntry(id) {
  const response = await api.get(`/stocks/${id}`);
  return response.data?.data ?? null;
}

export async function createStockEntry(payload) {
  const response = await api.post("/stocks", payload);
  return response.data?.data ?? null;
}

export async function updateStockEntry(id, payload) {
  const response = await api.put(`/stocks/${id}`, payload);
  return response.data?.data ?? null;
}

export async function deleteStockEntry(id) {
  const response = await api.delete(`/stocks/${id}`);
  return response.data?.data ?? null;
}

export async function getPeriodicStockReport(params = {}) {
  const response = await api.get("/stocks/periodic", { params });
  return response.data?.data ?? { periods: [], summary: {} };
}
