import { api } from "@/lib/api";
import { CreateProjectInput, Project, UpdateProjectInput } from "@/types/project.types";

export const getWorkspaceProjects = async (workspaceId: string): Promise<Project[]> => {
  const response = await api.get(`/projects/workspace/${workspaceId}`);
  return response.data.data;
};

export const createProject = async (data: CreateProjectInput): Promise<Project> => {
  const response = await api.post("/projects", data);
  return response.data.data;
};

export const updateProject = async (
  id: string,
  workspaceId: string,
  data: UpdateProjectInput,
): Promise<Project> => {
  // requireWorkspaceMember on the server resolves the workspace from the body,
  // since :projectId is the only route param — it must be included here.
  const response = await api.patch(`/projects/${id}`, { ...data, workspaceId });
  return response.data.data;
};

export const deleteProject = async (id: string, workspaceId: string): Promise<void> => {
  await api.delete(`/projects/${id}`, { data: { workspaceId } });
};
