import { Response } from "express";
import { TaskService } from "../services/task.services";
import { AuthRequest } from "../../../middleware/auth.middleware";

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthRequest, res: Response) {
    const task = await taskService.createTask(req.user!.userId, req.body);

    return res.status(201).json({
      success: true,
      data: task,
    });
  }

  async getTasks(req: AuthRequest, res: Response) {
    const tasks = await taskService.getUserTasks(req.user!.userId, req.query);

    return res.json({
      success: true,
      data: tasks,
    });
  }

  async getTaskById(req: AuthRequest, res: Response) {
    const task = await taskService.getTaskById(req.params.id as string, req.user!.userId);

    return res.json({
      success: true,
      data: task,
    });
  }

  async updateTask(req: AuthRequest, res: Response) {
    const task = await taskService.updateTask(
      req.params.id as string,
      req.user!.userId,
      req.body,
    );

    return res.json({
      success: true,
      data: task,
    });
  }

  async deleteTask(req: AuthRequest, res: Response) {
    await taskService.deleteTask(req.params.id as string, req.user!.userId);

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  }
}
