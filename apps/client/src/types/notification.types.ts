export type NotificationType =
  | "TASK_ASSIGNED"
  | "SUBTASK_LINKED"
  | "PRIORITY_CHANGED"
  | "COMMENT_REPLY"
  | "MENTIONED";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  userId: string;
  taskId?: string | null;
  read: boolean;
  createdAt: string;
}
