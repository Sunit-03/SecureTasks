export type StatusCategory = "TODO" | "IN_PROGRESS" | "DONE";

export interface WorkflowState {
  id: string;
  projectId: string;
  name: string;
  color: string;
  category: StatusCategory;
  order: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowStateInput {
  name: string;
  color?: string;
  category: StatusCategory;
  isDefault?: boolean;
}

export interface UpdateWorkflowStateInput {
  name?: string;
  color?: string;
  category?: StatusCategory;
  isDefault?: boolean;
}
