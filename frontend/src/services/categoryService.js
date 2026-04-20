import { api } from "./api";

let categoriesRequest = null;

export async function getCategories() {
  if (!categoriesRequest) {
    categoriesRequest = api
      .get("/categories")
      .then((response) => response.data?.data ?? [])
      .catch((error) => {
        categoriesRequest = null;
        throw error;
      });
  }

  return categoriesRequest;
}

export async function getCategory(id) {
  const response = await api.get(`/categories/${id}`);
  return response.data?.data ?? null;
}

export async function createCategory(payload) {
  const response = await api.post("/categories", payload);
  categoriesRequest = null;
  return response.data?.data ?? null;
}

export async function updateCategory(id, payload) {
  const response = await api.put(`/categories/${id}`, payload);
  categoriesRequest = null;
  return response.data?.data ?? null;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  categoriesRequest = null;
  return response.data?.data ?? null;
}
