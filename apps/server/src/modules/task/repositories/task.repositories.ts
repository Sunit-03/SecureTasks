import { TaskPriority, TaskStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

const projectSelect = { id: true, name: true, workspaceId: true };
const userSelect = { id: true, email: true };
const workflowStateSelect = { id: true, name: true, color: true, category: true, order: true };
const subtaskSelect = {
  id: true,
  title: true,
  statusId: true,
  status: { select: workflowStateSelect },
};

const taskInclude = {
  project: { select: projectSelect },
  assignee: { select: userSelect },
  status: { select: workflowStateSelect },
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
    statusId: string;
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
      category?: TaskStatus;
      workspaceId?: string;
      projectId?: string;
    },
  ) {
    const { page, limit, category, workspaceId, projectId } = options;

    return prisma.task.findMany({
      where: {
        project: {
          workspace: {
            members: { some: { userId } },
            ...(workspaceId && { id: workspaceId }),
          },
          ...(projectId && { id: projectId }),
        },
        ...(category && { status: { category } }),
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
      statusId?: string;
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
