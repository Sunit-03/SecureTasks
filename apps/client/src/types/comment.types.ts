export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: { id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
}
