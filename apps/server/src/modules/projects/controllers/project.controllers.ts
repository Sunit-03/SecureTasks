import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { ProjectService } from "../services/projects.services";

const projectService = new ProjectService();

export class ProjectController {
    async createProject(req: AuthRequest, res: Response){
        const project = await projectService.createProject(req.body);
        return res.status(201).json({success: true, data: project});
    }

    async getProjects(req: AuthRequest, res: Response){
        const projects = await projectService.getWorkspaceProjects(req.params.workspaceId as string);
        return res.json({success: true, data: projects});
    }

    async updateProject(req: AuthRequest, res: Response){
        const project = await projectService.updateProject(req.params.projectId as string, req.body);
        return res.json({success: true, data: project});
    }

    async deleteProject(req: AuthRequest, res: Response){
        await projectService.deleteProject(req.params.projectId as string);
        return res.json({success: true, message: "Project deleted successfully"});
    }
}