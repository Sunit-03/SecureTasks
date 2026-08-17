import { api } from "@/lib/api";
import {
  CreateWorkflowStateInput,
  UpdateWorkflowStateInput,
  WorkflowState,
} from "@/types/workflow-state.types";

export const getWorkflowStates = async (projectId: string): Promise<WorkflowState[]> => {
  const response = await api.get(`/projects/${projectId}/workflow-states`);
  return response.data.data;
};

export const createWorkflowState = async (
  projectId: string,
  data: CreateWorkflowStateInput,
): Promise<WorkflowState> => {
  const response = await api.post(`/projects/${projectId}/workflow-states`, data);
  return response.data.data;
};

export const updateWorkflowState = async (
  projectId: string,
  stateId: string,
  data: UpdateWorkflowStateInput,
): Promise<WorkflowState> => {
  const response = await api.patch(`/projects/${projectId}/workflow-states/${stateId}`, data);
  return response.data.data;
};

export const deleteWorkflowState = async (projectId: string, stateId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/workflow-states/${stateId}`);
};

export const reorderWorkflowStates = async (
  projectId: string,
  orderedIds: string[],
): Promise<WorkflowState[]> => {
  const response = await api.put(`/projects/${projectId}/workflow-states/reorder`, { orderedIds });
  return response.data.data;
};
