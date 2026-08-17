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
  async addMember(data: {
    workspaceId: string;
    userId: string;
    role: "ADMIN" | "MEMBER";
  }) {
    return prisma.workspaceMember.create({ data });
  }

  async getWorkspaceMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: { select: { id: true, email: true } } },
    });
  }
}
