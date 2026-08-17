"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createComment, deleteComment, getComments } from "@/services/comment.service";
import { CreateCommentInput } from "@/types/comment.types";

export const commentKeys = {
  byTask: (taskId: string) => ["comments", taskId] as const,
};

export function useComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: () => getComments(taskId),
    enabled: !!taskId,
  });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
    onError: () => toast.error("Could not post comment"),
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
    onError: () => toast.error("Could not delete comment"),
  });
}
