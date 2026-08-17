import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { hasRole } from "../../../utils/permissions";
import { logAudit } from "../../../utils/audit-log";
import { CommentRepository } from "../repositories/comment.repositories";
import { NotificationService } from "../../notifications/services/notification.service";

const commentRepository = new CommentRepository();
const notificationService = new NotificationService();

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

  async createComment(
    taskId: string,
    authorId: string,
    content: string,
    parentCommentId?: string,
    mentionedUserIds?: string[],
  ) {
    const { task, role } = await requireTaskMembership(taskId, authorId);

    if (!hasRole(role, "MEMBER")) {
      throw new AppError("Viewers cannot post comments", 403);
    }

    let parent: Awaited<ReturnType<typeof commentRepository.findById>> = null;
    if (parentCommentId) {
      parent = await commentRepository.findById(parentCommentId);
      if (!parent || parent.taskId !== taskId) {
        throw new AppError("Parent comment not found on this task", 404);
      }
    }

    const comment = await commentRepository.create({
      content,
      taskId,
      authorId,
      parentCommentId,
    });
    await logAudit(authorId, "comment.created", task.project.workspaceId, {
      taskId,
      commentId: comment.id,
      parentCommentId,
    });

    if (parent && parent.authorId !== authorId) {
      await notificationService.notifyUser(
        parent.authorId,
        "COMMENT_REPLY",
        `Someone replied to your comment on "${task.title}"`,
        taskId,
      );
    }

    if (mentionedUserIds && mentionedUserIds.length > 0) {
      const uniqueIds = [...new Set(mentionedUserIds)].filter(
        (id) => id !== authorId && id !== parent?.authorId,
      );
      const validMembers = await prisma.workspaceMember.findMany({
        where: { workspaceId: task.project.workspaceId, userId: { in: uniqueIds } },
        select: { userId: true },
      });
      for (const member of validMembers) {
        await notificationService.notifyUser(
          member.userId,
          "MENTIONED",
          `You were mentioned in a comment on "${task.title}"`,
          taskId,
        );
      }
    }

    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const { task, role } = await requireTaskMembership(comment.taskId, userId);

    if (comment.authorId !== userId && !hasRole(role, "ADMIN")) {
      throw new AppError("Only the comment author or an admin can delete this comment", 403);
    }

    await commentRepository.delete(commentId);
    await logAudit(userId, "comment.deleted", task.project.workspaceId, {
      taskId: comment.taskId,
      commentId,
    });
  }
}
