import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { hasRole } from "../../../utils/permissions";
import { logAudit } from "../../../utils/audit-log";
import { CommentRepository } from "../repositories/comment.repositories";

const commentRepository = new CommentRepository();

async function requireTaskMembership(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { select: { workspaceId: true } } },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: { workspaceId: task.project.workspaceId, userId },
  });

  if (!membership) {
    throw new AppError("Unauthorized", 403);
  }

  return { task, role: membership.role };
}

export class CommentService {
  async listComments(taskId: string, userId: string) {
    await requireTaskMembership(taskId, userId);
    return commentRepository.findByTaskId(taskId);
  }

  async createComment(taskId: string, authorId: string, content: string) {
    const { role } = await requireTaskMembership(taskId, authorId);

    if (!hasRole(role, "MEMBER")) {
      throw new AppError("Viewers cannot post comments", 403);
    }

    const comment = await commentRepository.create({ content, taskId, authorId });
    await logAudit(authorId, "comment.created", { taskId, commentId: comment.id });
    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const { role } = await requireTaskMembership(comment.taskId, userId);

    if (comment.authorId !== userId && !hasRole(role, "ADMIN")) {
      throw new AppError("Only the comment author or an admin can delete this comment", 403);
    }

    await commentRepository.delete(commentId);
    await logAudit(userId, "comment.deleted", { taskId: comment.taskId, commentId });
  }
}
