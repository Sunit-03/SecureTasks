"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/services/task.service";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task.types";
import { useWorkspaceStore } from "@/store/workspace.store";

export const taskKeys = {
  all: (workspaceId: string | null) => ["tasks", workspaceId] as const,
  byProject: (workspaceId: string | null, projectId: string | null) =>
    ["tasks", workspaceId, projectId] as const,
  detail: (id: string) => ["tasks", "detail", id] as const,
};

export function useTasks(projectId?: string | null) {
  const { activeWorkspaceId } = useWorkspaceStore();
  return useQuery({
    queryKey: projectId ? taskKeys.byProject(activeWorkspaceId, projectId) : taskKeys.all(activeWorkspaceId),
    queryFn: () => getTasks(activeWorkspaceId ?? undefined, projectId ?? undefined),
    enabled: !!activeWorkspaceId && (projectId === undefined || !!projectId),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspaceStore();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(activeWorkspaceId) });
      toast.success("Task created");
    },
    onError: () => toast.error("Could not create task"),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspaceStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      // getQueriesData({queryKey: ["tasks"]}) also matches the single-Task
      // detail cache (["tasks","detail",id]) — only list queries hold arrays.
      const previousEntries = queryClient.getQueriesData<Task[]>({ queryKey: ["tasks"] });
      previousEntries.forEach(([key, tasks]) => {
        if (!Array.isArray(tasks)) return;
        queryClient.setQueryData<Task[]>(
          key,
          tasks.map((task) => (task.id === id ? { ...task, ...data } : task)),
        );
      });
      return { previousEntries };
    },
    onError: (_err, _vars, context) => {
      context?.previousEntries.forEach(([key, tasks]) => {
        if (Array.isArray(tasks)) queryClient.setQueryData(key, tasks);
      });
      toast.error("Could not update task");
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspaceStore();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Could not delete task"),
  });
}
