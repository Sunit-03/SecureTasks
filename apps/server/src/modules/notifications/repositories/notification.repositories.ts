import { NotificationType } from "@prisma/client";
import prisma from "../../../config/prisma";

export class NotificationRepository {
  async createMany(
    notifications: { userId: string; type: NotificationType; message: string; taskId?: string }[],
  ) {
    if (notifications.length === 0) return;
    return prisma.notification.createMany({ data: notifications });
  }

  async findByUserId(userId: string, options: { page: number; limit: number }) {
    const { page, limit } = options;
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
