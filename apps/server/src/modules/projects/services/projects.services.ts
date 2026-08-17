import { AppError } from "../../../utils/errors/app-error";
import { ProjectRepository } from "../repositories/project.repositories";

const projectRepository = new ProjectRepository();

export class ProjectService {
    async createProject(data: {name: string; description?: string; workspaceId: string}) {
        return projectRepository.createProject(data);
    }

    async getWorkspaceProjects(workspaceId: string) {
        return projectRepository.findWorkspaceProjects(workspaceId);
    }

    async updateProject(projectId: string, data: {name?: string; description?: string}) {
        const project = await projectRepository.findById(projectId);
        if(!project){
            throw new AppError("Project not found", 404);
        }
        return projectRepository.update(projectId, data);
    }

    async deleteProject(projectId: string) {
        const project = await projectRepository.findById(projectId);
        if(!project){
            throw new AppError("Project not found", 404);
        }
        return projectRepository.delete(projectId);
    }
}