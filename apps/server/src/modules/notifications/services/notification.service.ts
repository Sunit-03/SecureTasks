import { NotificationType } from "@prisma/client";
import prisma from "../../../config/prisma";
import { NotificationRepository } from "../repositories/notification.repositories";

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async getUserNotifications(userId: string, query: { page?: string; limit?: string }) {
    const page = parseInt(query.page ?? "") || 1;
    const limit = parseInt(query.limit ?? "") || 20;
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.findByUserId(userId, { page, limit }),
      notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  }

  async markRead(id: string, userId: string) {
    await notificationRepository.markRead(id, userId);
  }

  async markAllRead(userId: string) {
    await notificationRepository.markAllRead(userId);
  }

  /** Notify a single user directly — e.g. the new assignee of a task. */
  async notifyUser(userId: string, type: NotificationType, message: string, taskId?: string) {
    if (!userId) return;
    await notificationRepository.createMany([{ userId, type, message, taskId }]);
  }

  /**
   * Notify every ADMIN/OWNER member of a workspace (excluding the actor who
   * triggered the event) — used for subtask-linked and priority-changed events.
   */
  async notifyWorkspaceAdmins(
    workspaceId: string,
    actorUserId: string,
    type: NotificationType,
    message: string,
    taskId?: string,
  ) {
    const admins = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
        role: { in: ["ADMIN", "OWNER"] },
        userId: { not: actorUserId },
      },
      select: { userId: true },
    });

    await notificationRepository.createMany(
      admins.map((a) => ({ userId: a.userId, type, message, taskId })),
    );
  }
}
