import { TaskPriority, TaskStatus } from "@prisma/client";
import { TaskRepository } from "../repositories/task.repositories";
import { AppError } from "../../../utils/errors/app-error";
import { hasRole } from "../../../utils/permissions";
import { logAudit } from "../../../utils/audit-log";
import { NotificationService } from "../../notifications/services/notification.service";
import prisma from "../../../config/prisma";

const taskRepository = new TaskRepository();
const notificationService = new NotificationService();

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  parentTaskId?: string | null;
}

export class TaskService {
  async createTask(
    createdById: string,
    data: {
      title: string;
      description?: string;
      projectId: string;
      priority?: TaskPriority;
    },
  ) {
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId: project.workspaceId, userId: createdById },
    });

    if (!membership || !hasRole(membership.role, "MEMBER")) {
      throw new AppError("Unauthorized", 403);
    }

    const task = await taskRepository.create({ ...data, createdById });
    await logAudit(createdById, "task.created", { taskId: task.id, projectId: data.projectId });
    return task;
  }

  async getUserTasks(userId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const status = query.status as TaskStatus | undefined;
    const workspaceId = query.workspaceId as string | undefined;
    return taskRepository.findVisibleToUser(userId, { page, limit, status, workspaceId });
  }

  private async getTaskWithMembership(taskId: string, userId: string) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId: task.project.workspaceId, userId },
    });

    if (!membership) {
      throw new AppError("Unauthorized", 403);
    }

    return { task, role: membership.role, workspaceId: task.project.workspaceId };
  }

  async getTaskById(taskId: string, userId: string) {
    const { task } = await this.getTaskWithMembership(taskId, userId);
    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    const { task, role, workspaceId } = await this.getTaskWithMembership(taskId, userId);

    if (!hasRole(role, "MEMBER")) {
      throw new AppError("Viewers cannot edit tasks", 403);
    }

    const isCreatorOrOwner = task.createdById === userId || role === "OWNER";

    if (data.title !== undefined && !isCreatorOrOwner) {
      throw new AppError("Only the task creator or the workspace owner can edit the title", 403);
    }

    if (data.description !== undefined && !isCreatorOrOwner) {
      throw new AppError(
        "Only the task creator or the workspace owner can edit the description",
        403,
      );
    }

    if (data.assigneeId) {
      const assigneeMembership = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: data.assigneeId },
      });
      if (!assigneeMembership) {
        throw new AppError("Assignee must be a member of this workspace", 400);
      }
    }

    if (data.parentTaskId) {
      if (data.parentTaskId === taskId) {
        throw new AppError("A task cannot be a subtask of itself", 400);
      }

      const parentTask = await prisma.task.findUnique({
        where: { id: data.parentTaskId },
        include: { project: { select: { workspaceId: true } } },
      });

      if (!parentTask || parentTask.project.workspaceId !== workspaceId) {
        throw new AppError("Parent task must belong to the same workspace", 400);
      }

      if (parentTask.parentTaskId === taskId) {
        throw new AppError("This would create a circular subtask link", 400);
      }
    }

    const updated = await taskRepository.update(task.id, data);

    await logAudit(userId, "task.updated", { taskId, fields: Object.keys(data) });

    if (data.assigneeId && data.assigneeId !== task.assigneeId && data.assigneeId !== userId) {
      await notificationService.notifyUser(
        data.assigneeId,
        "TASK_ASSIGNED",
        `You were assigned to "${updated.title}"`,
        taskId,
      );
    }

    if (data.parentTaskId && data.parentTaskId !== task.parentTaskId) {
      await notificationService.notifyWorkspaceAdmins(
        workspaceId,
        userId,
        "SUBTASK_LINKED",
        `"${updated.title}" was linked as a subtask`,
        taskId,
      );
    }

    if (data.priority && data.priority !== task.priority) {
      await notificationService.notifyWorkspaceAdmins(
        workspaceId,
        userId,
        "PRIORITY_CHANGED",
        `Priority of "${updated.title}" changed to ${data.priority}`,
        taskId,
      );
    }

    return updated;
  }

  async deleteTask(taskId: string, userId: string) {
    const { task, role } = await this.getTaskWithMembership(taskId, userId);

    if (!hasRole(role, "ADMIN")) {
      throw new AppError("Only an admin or owner can delete tasks", 403);
    }

    await taskRepository.delete(task.id);
    await logAudit(userId, "task.deleted", { taskId });
  }
}
