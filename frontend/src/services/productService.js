import { api } from "./api";

function isFormData(payload) {
  return typeof FormData !== "undefined" && payload instanceof FormData;
}

export async function getProducts(options) {
  const params = typeof options === "number" ? { page: options } : { ...(options || {}) };
  const response = await api.get("/products", {
    params,
  });
  const products = response.data?.data ?? [];

  if (typeof options === "number" || options?.page) {
    return products;
  }

  return Array.isArray(products?.data) ? products.data : products;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data?.data ?? null;
}

export async function createProduct(payload) {
  const response = await api.post("/products", payload);
  return response.data?.data ?? null;
}

export async function updateProduct(id, payload) {
  if (isFormData(payload)) {
    payload.append("_method", "PUT");
    const response = await api.post(`/products/${id}`, payload);
    return response.data?.data ?? null;
  }

  const response = await api.put(`/products/${id}`, payload);
  return response.data?.data ?? null;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data?.data ?? null;
}
