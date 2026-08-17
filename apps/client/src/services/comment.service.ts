import { api } from "@/lib/api";
import { Comment, CreateCommentInput } from "@/types/comment.types";

export const getComments = async (taskId: string): Promise<Comment[]> => {
  const response = await api.get(`/tasks/${taskId}/comments`);
  return response.data.data;
};

export const createComment = async (
  taskId: string,
  data: CreateCommentInput,
): Promise<Comment> => {
  const response = await api.post(`/tasks/${taskId}/comments`, data);
  return response.data.data;
};

export const deleteComment = async (taskId: string, commentId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}/comments/${commentId}`);
};
