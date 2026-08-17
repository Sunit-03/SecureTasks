import prisma from "../../../config/prisma";

const authorSelect = { id: true, email: true };

export class CommentRepository {
  async create(data: { content: string; taskId: string; authorId: string }) {
    return prisma.comment.create({
      data,
      include: { author: { select: authorSelect } },
    });
  }

  async findByTaskId(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: authorSelect } },
    });
  }

  async findById(id: string) {
    return prisma.comment.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  }
}
