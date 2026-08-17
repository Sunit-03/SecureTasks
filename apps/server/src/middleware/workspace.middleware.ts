import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import prisma from "../config/prisma";

export const requireWorkspaceMember = async(req: AuthRequest, res: Response, next: NextFunction) => {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;
    const membership = await prisma.workspaceMember.findFirst({where: {workspaceId, userId: req.user!.userId}});

    if(!membership){
        return res.status(403).json({success: false, message: "Access denied. Not a workspace member."});
    }

    req.workspaceMember = membership;
    next();
}