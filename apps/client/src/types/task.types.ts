import { WorkflowState } from "@/types/workflow-state.types";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskUserRef {
  id: string;
  email: string;
}

export interface WorkflowStateRef {
  id: string;
  name: string;
  color: string;
  category: WorkflowState["category"];
  order: number;
}

export interface SubtaskRef {
  id: string;
  title: string;
  statusId: string;
  status: WorkflowStateRef;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  statusId: string;
  status: WorkflowStateRef;
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
  statusId?: string;
  priority?: TaskPriority;
  assigneeId?: string | null;
  parentTaskId?: string | null;
  mentionedUserIds?: string[];
}
