"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createWorkflowState,
  deleteWorkflowState,
  getWorkflowStates,
  reorderWorkflowStates,
  updateWorkflowState,
} from "@/services/workflow-state.service";
import { CreateWorkflowStateInput, UpdateWorkflowStateInput } from "@/types/workflow-state.types";

export const workflowStateKeys = {
  byProject: (projectId: string) => ["workflow-states", projectId] as const,
};

export function useWorkflowStates(projectId: string | null) {
  return useQuery({
    queryKey: workflowStateKeys.byProject(projectId ?? ""),
    queryFn: () => getWorkflowStates(projectId as string),
    enabled: !!projectId,
  });
}

function errorMessage(err: unknown, fallback: string) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;
}

export function useCreateWorkflowState(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkflowStateInput) => createWorkflowState(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowStateKeys.byProject(projectId) });
      toast.success("Status added");
    },
    onError: (err) => toast.error(errorMessage(err, "Could not add status")),
  });
}

export function useUpdateWorkflowState(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stateId, data }: { stateId: string; data: UpdateWorkflowStateInput }) =>
      updateWorkflowState(projectId, stateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowStateKeys.byProject(projectId) });
      toast.success("Status updated");
    },
    onError: (err) => toast.error(errorMessage(err, "Could not update status")),
  });
}

export function useDeleteWorkflowState(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stateId: string) => deleteWorkflowState(projectId, stateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowStateKeys.byProject(projectId) });
      toast.success("Status deleted");
    },
    onError: (err) => toast.error(errorMessage(err, "Could not delete status")),
  });
}

export function useReorderWorkflowStates(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderWorkflowStates(projectId, orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowStateKeys.byProject(projectId) });
    },
    onError: (err) => toast.error(errorMessage(err, "Could not reorder statuses")),
  });
}
