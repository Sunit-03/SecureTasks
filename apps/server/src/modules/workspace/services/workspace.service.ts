import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { WorkspaceRepository } from "../repositories/workspace.repositories";

const workspaceRepository = new WorkspaceRepository();

export class WorkspaceService {
  async createWorkspace(userId: string, data: { name: string }) {
    return workspaceRepository.createWorkspace(userId, data.name);
  }

  async getUserWorkspaces(userId: string) {
    return workspaceRepository.findUserWorkspaces(userId);
  }

  async addMember(workspaceId: string, email: string, role: "ADMIN" | "MEMBER") {
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

    return workspaceRepository.addMember({ workspaceId, userId: user.id, role });
  }

  async getWorkspaceMembers(workspaceId: string) {
    return workspaceRepository.getWorkspaceMembers(workspaceId);
  }
}
