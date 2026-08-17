"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addWorkspaceMember,
  createWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  updateWorkspaceMemberRole,
} from "@/services/workspace.service";
import {
  AddMemberInput,
  CreateWorkspaceInput,
  UpdateMemberRoleInput,
  WorkspaceRole,
} from "@/types/workspace.types";
import { useAuthStore } from "@/store/auth.store";

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

/** The current user's role in a workspace, or null if not a member (yet) / not loaded. */
export function useMyWorkspaceRole(workspaceId: string | null): WorkspaceRole | null {
  const { user } = useAuthStore();
  const { data: members } = useWorkspaceMembers(workspaceId);
  return members?.find((m) => m.userId === user?.id)?.role ?? null;
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
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not invite member";
      toast.error(message);
    },
  });
}

export function useUpdateWorkspaceMemberRole(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateMemberRoleInput }) =>
      updateWorkspaceMemberRole(workspaceId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.members(workspaceId) });
      toast.success("Member role updated");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not update member role";
      toast.error(message);
    },
  });
}
