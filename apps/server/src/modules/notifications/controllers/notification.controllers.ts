import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response) {
    const { notifications, unreadCount } = await notificationService.getUserNotifications(
      req.user!.userId,
      req.query as { page?: string; limit?: string },
    );
    return res.json({ success: true, data: notifications, unreadCount });
  }

  async markRead(req: AuthRequest, res: Response) {
    await notificationService.markRead(req.params.id as string, req.user!.userId);
    return res.json({ success: true, message: "Notification marked as read" });
  }

  async markAllRead(req: AuthRequest, res: Response) {
    await notificationService.markAllRead(req.user!.userId);
    return res.json({ success: true, message: "All notifications marked as read" });
  }
}
