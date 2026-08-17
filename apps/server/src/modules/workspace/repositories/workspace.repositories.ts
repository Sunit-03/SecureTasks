import { WorkspaceRole } from "@prisma/client";
import prisma from "../../../config/prisma";

export class WorkspaceRepository {
  async createWorkspace(ownerId: string, name: string) {
    return prisma.workspace.create({
      data: {
        name,
        ownerId,
        members: { create: { userId: ownerId, role: "OWNER" } },
      },
      include: { members: true },
    });
  }

  async findUserWorkspaces(userId: string) {
    return prisma.workspace.findMany({
      where: { members: { some: { userId } } },
    });
  }

  async findById(id: string) {
    return prisma.workspace.findUnique({ where: { id } });
  }

  async deleteWorkspace(id: string) {
    // Cascades to members, projects, and their tasks/comments (see schema.prisma).
    return prisma.workspace.delete({ where: { id } });
  }
  async addMember(data: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }) {
    return prisma.workspaceMember.create({ data });
  }

  async getWorkspaceMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async findMembership(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
  }

  async findMemberById(memberId: string) {
    return prisma.workspaceMember.findUnique({ where: { id: memberId } });
  }

  async updateMemberRole(memberId: string, role: WorkspaceRole) {
    return prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
      include: { user: { select: { id: true, email: true } } },
    });
  }
}
