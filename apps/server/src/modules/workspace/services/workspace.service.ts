import { WorkspaceRole } from "@prisma/client";
import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { hasRole } from "../../../utils/permissions";
import { logAudit } from "../../../utils/audit-log";
import { WorkspaceRepository } from "../repositories/workspace.repositories";

const workspaceRepository = new WorkspaceRepository();

export class WorkspaceService {
  async createWorkspace(userId: string, data: { name: string }) {
    return workspaceRepository.createWorkspace(userId, data.name);
  }

  async getUserWorkspaces(userId: string) {
    return workspaceRepository.findUserWorkspaces(userId);
  }

  async addMember(
    workspaceId: string,
    callerId: string,
    email: string,
    role: "ADMIN" | "MEMBER" | "VIEWER",
  ) {
    const callerMembership = await workspaceRepository.findMembership(workspaceId, callerId);
    if (!callerMembership || !hasRole(callerMembership.role, "ADMIN")) {
      throw new AppError("Only an admin or owner can invite members", 403);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const existingMembership = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: user.id },
    });
    if (existingMembership) {
      throw new AppError("User is already a member of this workspace", 409);
    }

    const member = await workspaceRepository.addMember({ workspaceId, userId: user.id, role });
    await logAudit(callerId, "workspace.member_invited", workspaceId, {
      invitedUserId: user.id,
      role,
    });
    return member;
  }

  async getWorkspaceMembers(workspaceId: string) {
    return workspaceRepository.getWorkspaceMembers(workspaceId);
  }

  async updateMemberRole(
    workspaceId: string,
    callerId: string,
    memberId: string,
    role: "ADMIN" | "MEMBER" | "VIEWER",
  ) {
    const callerMembership = await workspaceRepository.findMembership(workspaceId, callerId);
    if (!callerMembership || callerMembership.role !== "OWNER") {
      throw new AppError("Only the workspace owner can change member roles", 403);
    }

    const target = await workspaceRepository.findMemberById(memberId);
    if (!target || target.workspaceId !== workspaceId) {
      throw new AppError("Member not found in this workspace", 404);
    }

    if (target.role === "OWNER") {
      throw new AppError("Owner role cannot be changed here", 403);
    }

    if (target.userId === callerId) {
      throw new AppError("You cannot change your own role", 400);
    }

    const updated = await workspaceRepository.updateMemberRole(memberId, role as WorkspaceRole);
    await logAudit(callerId, "workspace.member_role_changed", workspaceId, {
      memberId,
      newRole: role,
    });
    return updated;
  }

  async deleteWorkspace(workspaceId: string, callerId: string) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    const callerMembership = await workspaceRepository.findMembership(workspaceId, callerId);
    if (!callerMembership || callerMembership.role !== "OWNER") {
      throw new AppError("Only the workspace owner can delete this workspace", 403);
    }

    // Log before deleting: once the workspace row is gone, a FK reference to
    // it in this same insert would violate referential integrity even
    // though the column is nullable.
    await logAudit(callerId, "workspace.deleted", workspaceId, { workspaceName: workspace.name });
    await workspaceRepository.deleteWorkspace(workspaceId);
  }
}
