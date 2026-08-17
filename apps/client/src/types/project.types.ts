export interface Project {
  id: string;
  name: string;
  description?: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}
