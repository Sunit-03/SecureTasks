"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addWorkspaceMember,
  createWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
} from "@/services/workspace.service";
import { AddMemberInput, CreateWorkspaceInput } from "@/types/workspace.types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  members: (workspaceId: string) => ["workspaces", workspaceId, "members"] as const,
};

export function useWorkspaces() {
  return useQuery({ queryKey: workspaceKeys.all, queryFn: getWorkspaces });
}

export function useWorkspaceMembers(workspaceId: string | null) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId ?? ""),
    queryFn: () => getWorkspaceMembers(workspaceId as string),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success("Workspace created");
    },
    onError: () => toast.error("Could not create workspace"),
  });
}

export function useAddWorkspaceMember(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddMemberInput) => addWorkspaceMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
      toast.success("Member invited");
    },
    onError: () => toast.error("Could not invite member"),
  });
}
