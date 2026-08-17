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
  detail: (id: string) => ["tasks", "detail", id] as const,
};

export function useTasks() {
  const { activeWorkspaceId } = useWorkspaceStore();
  return useQuery({
    queryKey: taskKeys.all(activeWorkspaceId),
    queryFn: () => getTasks(activeWorkspaceId ?? undefined),
    enabled: !!activeWorkspaceId,
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
  const listKey = taskKeys.all(activeWorkspaceId);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<Task[]>(listKey);
      if (previous) {
        queryClient.setQueryData<Task[]>(
          listKey,
          previous.map((task) => (task.id === id ? { ...task, ...data } : task)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
      toast.error("Could not update task");
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: listKey });
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
      queryClient.invalidateQueries({ queryKey: taskKeys.all(activeWorkspaceId) });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Could not delete task"),
  });
}
