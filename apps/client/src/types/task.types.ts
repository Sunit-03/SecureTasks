export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskUserRef {
  id: string;
  email: string;
}

export interface SubtaskRef {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  project?: { id: string; name: string; workspaceId: string };
  createdById: string;
  assigneeId?: string | null;
  assignee?: TaskUserRef | null;
  parentTaskId?: string | null;
  parentTask?: SubtaskRef | null;
  subtasks?: SubtaskRef[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  parentTaskId?: string | null;
}
