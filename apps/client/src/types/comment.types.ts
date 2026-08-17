export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: { id: string; email: string };
  parentCommentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
  parentCommentId?: string;
  mentionedUserIds?: string[];
}
