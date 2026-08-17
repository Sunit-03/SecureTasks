import { TaskStatus } from "@prisma/client";
import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { logAudit } from "../../../utils/audit-log";
import { WorkflowStateRepository } from "../repositories/workflow-state.repositories";

const workflowStateRepository = new WorkflowStateRepository();

async function requireProjectMembership(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId },
  });

  if (!membership) {
    throw new AppError("Unauthorized", 403);
  }

  return { project, role: membership.role };
}

async function requireProjectOwner(projectId: string, userId: string) {
  const { project, role } = await requireProjectMembership(projectId, userId);
  if (role !== "OWNER") {
    throw new AppError("Only the workspace owner can edit the workflow", 403);
  }
  return project;
}

export class WorkflowStateService {
  async listStates(projectId: string, userId: string) {
    await requireProjectMembership(projectId, userId);
    return workflowStateRepository.findByProjectId(projectId);
  }

  async createState(
    projectId: string,
    userId: string,
    data: { name: string; color?: string; category: TaskStatus; isDefault?: boolean },
  ) {
    const project = await requireProjectOwner(projectId, userId);

    const order = (await workflowStateRepository.getMaxOrder(projectId)) + 1;
    const state = await workflowStateRepository.create({ projectId, order, ...data, isDefault: !!data.isDefault });

    if (state.isDefault) {
      await workflowStateRepository.clearDefaultExcept(projectId, state.id);
    }

    await logAudit(userId, "workflow_state.created", project.workspaceId, {
      projectId,
      stateId: state.id,
    });
    return state;
  }

  async updateState(
    projectId: string,
    userId: string,
    stateId: string,
    data: { name?: string; color?: string; category?: TaskStatus; isDefault?: boolean },
  ) {
    const project = await requireProjectOwner(projectId, userId);

    const existing = await workflowStateRepository.findById(stateId);
    if (!existing || existing.projectId !== projectId) {
      throw new AppError("Workflow status not found in this project", 404);
    }

    const updated = await workflowStateRepository.update(stateId, data);

    if (data.isDefault) {
      await workflowStateRepository.clearDefaultExcept(projectId, stateId);
    }

    await logAudit(userId, "workflow_state.updated", project.workspaceId, { projectId, stateId });
    return updated;
  }

  async deleteState(projectId: string, userId: string, stateId: string) {
    const project = await requireProjectOwner(projectId, userId);

    const existing = await workflowStateRepository.findById(stateId);
    if (!existing || existing.projectId !== projectId) {
      throw new AppError("Workflow status not found in this project", 404);
    }

    const allStates = await workflowStateRepository.findByProjectId(projectId);
    if (allStates.length <= 1) {
      throw new AppError("A project must have at least one workflow status", 400);
    }

    const taskCount = await workflowStateRepository.countTasksInState(stateId);
    if (taskCount > 0) {
      throw new AppError(
        `${taskCount} task(s) are still in this status — move them before deleting it`,
        409,
      );
    }

    await workflowStateRepository.delete(stateId);
    await logAudit(userId, "workflow_state.deleted", project.workspaceId, { projectId, stateId });

    if (existing.isDefault) {
      const remaining = await workflowStateRepository.findByProjectId(projectId);
      const fallback = remaining[0];
      if (fallback) {
        await workflowStateRepository.update(fallback.id, { isDefault: true });
      }
    }
  }

  async reorderStates(projectId: string, userId: string, orderedIds: string[]) {
    const project = await requireProjectOwner(projectId, userId);

    const existing = await workflowStateRepository.findByProjectId(projectId);
    const existingIds = new Set(existing.map((s) => s.id));

    if (orderedIds.length !== existing.length || orderedIds.some((id) => !existingIds.has(id))) {
      throw new AppError("orderedIds must include every workflow status for this project exactly once", 400);
    }

    await Promise.all(orderedIds.map((id, index) => workflowStateRepository.setOrder(id, index)));
    await logAudit(userId, "workflow_state.reordered", project.workspaceId, { projectId });

    return workflowStateRepository.findByProjectId(projectId);
  }
}
