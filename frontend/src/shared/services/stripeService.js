import { api } from "./api";

export async function createStripePaymentIntent(payload) {
  const response = await api.post("/stripe/payment-intent", payload);
  return response.data?.data ?? null;
}
