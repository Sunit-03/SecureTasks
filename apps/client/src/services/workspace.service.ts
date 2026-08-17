import { api } from "@/lib/api";
import {
  AddMemberInput,
  CreateWorkspaceInput,
  Workspace,
  WorkspaceMember,
} from "@/types/workspace.types";

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspaces");
  return response.data.data;
};

export const createWorkspace = async (data: CreateWorkspaceInput): Promise<Workspace> => {
  const response = await api.post("/workspaces", data);
  return response.data.data;
};

export const getWorkspaceMembers = async (
  workspaceId: string,
): Promise<WorkspaceMember[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/members`);
  return response.data.data;
};

export const addWorkspaceMember = async (
  workspaceId: string,
  data: AddMemberInput,
): Promise<WorkspaceMember> => {
  const response = await api.post(`/workspaces/${workspaceId}/members`, data);
  return response.data.data;
};
