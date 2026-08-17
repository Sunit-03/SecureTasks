import { TaskStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

export class WorkflowStateRepository {
  async findByProjectId(projectId: string) {
    return prisma.workflowState.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.workflowState.findUnique({ where: { id } });
  }

  async findDefault(projectId: string) {
    return prisma.workflowState.findFirst({
      where: { projectId, isDefault: true },
      orderBy: { order: "asc" },
    });
  }

  async countTasksInState(stateId: string) {
    return prisma.task.count({ where: { statusId: stateId } });
  }

  async getMaxOrder(projectId: string) {
    const last = await prisma.workflowState.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
    });
    return last?.order ?? -1;
  }

  async create(data: {
    projectId: string;
    name: string;
    color?: string;
    category: TaskStatus;
    order: number;
    isDefault: boolean;
  }) {
    return prisma.workflowState.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; color?: string; category?: TaskStatus; isDefault?: boolean },
  ) {
    return prisma.workflowState.update({ where: { id }, data });
  }

  async clearDefaultExcept(projectId: string, keepId: string) {
    return prisma.workflowState.updateMany({
      where: { projectId, id: { not: keepId }, isDefault: true },
      data: { isDefault: false },
    });
  }

  async delete(id: string) {
    return prisma.workflowState.delete({ where: { id } });
  }

  async setOrder(id: string, order: number) {
    return prisma.workflowState.update({ where: { id }, data: { order } });
  }

  async seedDefaults(projectId: string) {
    return prisma.workflowState.createMany({
      data: [
        { projectId, name: "To Do", category: "TODO", order: 0, color: "#a1a1aa", isDefault: true },
        {
          projectId,
          name: "In Progress",
          category: "IN_PROGRESS",
          order: 1,
          color: "#2e5eff",
          isDefault: false,
        },
        { projectId, name: "Done", category: "DONE", order: 2, color: "#7ed321", isDefault: false },
      ],
    });
  }
}
