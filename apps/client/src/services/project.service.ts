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

export const updateProject = async (id: string, data: UpdateProjectInput): Promise<Project> => {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
