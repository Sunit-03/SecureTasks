import { api } from "@/lib/api";
import { Notification } from "@/types/notification.types";

export const getNotifications = async (): Promise<{
  notifications: Notification[];
  unreadCount: number;
}> => {
  const response = await api.get("/notifications", { params: { limit: 20 } });
  return { notifications: response.data.data, unreadCount: response.data.unreadCount };
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};
