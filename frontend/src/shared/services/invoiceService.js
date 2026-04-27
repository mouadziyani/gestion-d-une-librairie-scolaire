import { api } from "./api";

export async function listInvoices(params = {}) {
  const response = await api.get("/invoices", { params });
  return response.data?.data;
}

export async function getInvoice(id) {
  const response = await api.get(`/invoices/${id}`);
  return response.data?.data;
}

export async function createInvoice(payload) {
  const response = await api.post("/invoices", payload);
  return response.data?.data;
}

export async function updateInvoice(id, payload) {
  const response = await api.put(`/invoices/${id}`, payload);
  return response.data?.data;
}

export async function deleteInvoice(id) {
  const response = await api.delete(`/invoices/${id}`);
  return response.data?.data;
}
