import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
  workspaceMember?: {
    id: string;
    role: string;
    workspaceId: string;
    userId: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Missing token" });
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token as string, process.env.JWT_ACCESS_SECRET! as string) as unknown as {
            userId: string;
            role: string;
        };

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}