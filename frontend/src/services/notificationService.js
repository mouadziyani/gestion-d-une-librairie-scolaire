import { api } from "./api";

export async function getNotifications() {
  const response = await api.get("/notifications");
  return response.data?.data ?? [];
}

export async function getUnreadNotificationCount() {
  const notifications = await getNotifications();
  return Array.isArray(notifications)
    ? notifications.filter((notification) => !notification.is_read).length
    : 0;
}

export async function markNotificationRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data?.data ?? null;
}

export async function markAllNotificationsRead() {
  const response = await api.patch("/notifications/read-all");
  return response.data?.data ?? null;
}
