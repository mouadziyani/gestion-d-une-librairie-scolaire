import { api } from "./api";

export async function submitCheckout(payload) {
  const response = await api.post("/checkout", payload);
  return response.data?.data ?? null;
}

