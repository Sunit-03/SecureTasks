import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

export async function logAudit(
  userId: string,
  action: string,
  workspaceId?: string,
  metadata?: Record<string, unknown>,
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      workspaceId,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
