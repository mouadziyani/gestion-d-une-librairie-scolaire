import { api } from "@/shared/services/api";

export async function getRoles() {
  const response = await api.get("/roles");
  return response.data?.data ?? [];
}
