import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();

export class CommentController {
  async getComments(req: AuthRequest, res: Response) {
    const comments = await commentService.listComments(req.params.taskId as string, req.user!.userId);
    return res.json({ success: true, data: comments });
  }

  async createComment(req: AuthRequest, res: Response) {
    const comment = await commentService.createComment(
      req.params.taskId as string,
      req.user!.userId,
      req.body.content,
      req.body.parentCommentId,
      req.body.mentionedUserIds,
    );
    return res.status(201).json({ success: true, data: comment });
  }

  async deleteComment(req: AuthRequest, res: Response) {
    await commentService.deleteComment(req.params.commentId as string, req.user!.userId);
    return res.json({ success: true, message: "Comment deleted successfully" });
  }
}
