import { AppError } from "../../../utils/errors/app-error";
import { hasRole } from "../../../utils/permissions";
import { logAudit } from "../../../utils/audit-log";
import prisma from "../../../config/prisma";
import { ProjectRepository } from "../repositories/project.repositories";

const projectRepository = new ProjectRepository();

async function requireWorkspaceRole(workspaceId: string, userId: string, min: "ADMIN" | "OWNER" = "ADMIN") {
    const membership = await prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
    if (!membership || !hasRole(membership.role, min)) {
        throw new AppError("Only an admin or owner can manage projects", 403);
    }
    return membership;
}

export class ProjectService {
    async createProject(callerId: string, data: {name: string; description?: string; workspaceId: string}) {
        await requireWorkspaceRole(data.workspaceId, callerId);
        const project = await projectRepository.createProject(data);
        await logAudit(callerId, "project.created", { projectId: project.id, workspaceId: data.workspaceId });
        return project;
    }

    async getWorkspaceProjects(workspaceId: string) {
        return projectRepository.findWorkspaceProjects(workspaceId);
    }

    async updateProject(callerId: string, projectId: string, data: {name?: string; description?: string}) {
        const project = await projectRepository.findById(projectId);
        if(!project){
            throw new AppError("Project not found", 404);
        }
        // Authorize against the project's real workspace, never a client-supplied one.
        await requireWorkspaceRole(project.workspaceId, callerId);
        const updated = await projectRepository.update(projectId, data);
        await logAudit(callerId, "project.updated", { projectId });
        return updated;
    }

    async deleteProject(callerId: string, projectId: string) {
        const project = await projectRepository.findById(projectId);
        if(!project){
            throw new AppError("Project not found", 404);
        }
        await requireWorkspaceRole(project.workspaceId, callerId);
        await projectRepository.delete(projectId);
        await logAudit(callerId, "project.deleted", { projectId });
    }
}
