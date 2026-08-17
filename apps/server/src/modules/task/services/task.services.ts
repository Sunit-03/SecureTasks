import { TaskPriority, TaskStatus } from "@prisma/client";
import { TaskRepository } from "../repositories/task.repositories";
import { AppError } from "../../../utils/errors/app-error";
import prisma from "../../../config/prisma";

const taskRepository = new TaskRepository();

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

    if (!membership) {
      throw new AppError("Unauthorized", 403);
    }

    return taskRepository.create({ ...data, createdById });
  }

  async getUserTasks(userId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const status = query.status as TaskStatus | undefined;
    const workspaceId = query.workspaceId as string | undefined;
    return taskRepository.findVisibleToUser(userId, { page, limit, status, workspaceId });
  }

  async getTaskById(taskId: string, userId: string) {
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

    return task;
  }

  async updateTask(
    taskId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      status?: "TODO" | "IN_PROGRESS" | "DONE";
      priority?: TaskPriority;
    },
  ) {
    const task = await this.getTaskById(taskId, userId);

    if (data.description !== undefined && task.createdById !== userId) {
      const ownerMembership = await prisma.workspaceMember.findFirst({
        where: { workspaceId: task.project.workspaceId, userId, role: "OWNER" },
      });

      if (!ownerMembership) {
        throw new AppError(
          "Only the task creator or the workspace owner can edit the description",
          403,
        );
      }
    }

    return taskRepository.update(task.id, data);
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId, userId);
    return taskRepository.delete(task.id);
  }
}
