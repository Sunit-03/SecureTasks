export type NotificationType = "TASK_ASSIGNED" | "SUBTASK_LINKED" | "PRIORITY_CHANGED";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  userId: string;
  taskId?: string | null;
  read: boolean;
  createdAt: string;
}
