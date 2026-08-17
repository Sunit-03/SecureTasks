import { api } from "@/lib/api";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task.types";
import { StatusCategory } from "@/types/workflow-state.types";

export const getTasks = async (
  workspaceId?: string,
  projectId?: string,
  category?: StatusCategory,
): Promise<Task[]> => {
  const response = await api.get("/tasks", {
    params: {
      limit: 100,
      ...(workspaceId ? { workspaceId } : {}),
      ...(projectId ? { projectId } : {}),
      ...(category ? { category } : {}),
    },
  });
  return response.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data.data;
};

export const updateTask = async (id: string, data: UpdateTaskInput): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
