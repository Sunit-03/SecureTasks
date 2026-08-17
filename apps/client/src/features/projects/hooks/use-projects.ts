"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  getWorkspaceProjects,
  updateProject,
} from "@/services/project.service";
import { CreateProjectInput, UpdateProjectInput } from "@/types/project.types";

export const projectKeys = {
  byWorkspace: (workspaceId: string) => ["projects", workspaceId] as const,
};

export function useProjects(workspaceId: string | null) {
  return useQuery({
    queryKey: projectKeys.byWorkspace(workspaceId ?? ""),
    queryFn: () => getWorkspaceProjects(workspaceId as string),
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.byWorkspace(workspaceId) });
      toast.success("Project created");
    },
    onError: () => toast.error("Could not create project"),
  });
}

export function useUpdateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      updateProject(id, workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.byWorkspace(workspaceId) });
      toast.success("Project updated");
    },
    onError: () => toast.error("Could not update project"),
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.byWorkspace(workspaceId) });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Could not delete project"),
  });
}
