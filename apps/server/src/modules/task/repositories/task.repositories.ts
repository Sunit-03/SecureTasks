import { TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

const projectSelect = { id: true, name: true, workspaceId: true };
const userSelect = { id: true, email: true };
const subtaskSelect = { id: true, title: true, status: true };

const taskInclude = {
  project: { select: projectSelect },
  assignee: { select: userSelect },
  parentTask: { select: subtaskSelect },
  subtasks: { select: subtaskSelect },
};

export class TaskRepository {
  async create(data: {
    title: string;
    description?: string;
    projectId: string;
    createdById: string;
    priority?: TaskPriority;
  }) {
    return prisma.task.create({
      data,
      include: taskInclude,
    });
  }

  async findVisibleToUser(
    userId: string,
    options: {
      page: number;
      limit: number;
      status?: TaskStatus;
      workspaceId?: string;
    },
  ) {
    const { page, limit, status, workspaceId } = options;

    return prisma.task.findMany({
      where: {
        project: {
          workspace: {
            members: { some: { userId } },
            ...(workspaceId && { id: workspaceId }),
          },
        },
        ...(status && { status }),
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: taskInclude,
    });
  }

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: "TODO" | "IN_PROGRESS" | "DONE";
      priority?: TaskPriority;
      assigneeId?: string | null;
      parentTaskId?: string | null;
    },
  ) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}
