import prisma from "../../../config/prisma";

export class ProjectRepository {
    async createProject(data: {name: string; description?: string; workspaceId: string}) {
        return prisma.project.create({data});
    }

    async findWorkspaceProjects(workspaceId: string) {
        return prisma.project.findMany({where: {workspaceId}, orderBy: {createdAt: "desc"}});
    }

    async findById(id: string) {
        return prisma.project.findUnique({where: {id}});
    }

    async update(id: string, data:{name?: string; description?: string}) {
        return prisma.project.update({where: {id}, data});
    }

    async delete(id: string) {
        return prisma.project.delete({where: {id}});
    }
}