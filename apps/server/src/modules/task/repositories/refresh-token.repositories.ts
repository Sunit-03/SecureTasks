import prisma from "../../../config/prisma";
import { parseDurationMs } from "../../../utils/parse-duration";

export class RefreshTokenRepository {
  async create(userId: string) {
    const expiresAt = new Date(
      Date.now() + parseDurationMs(process.env.REFRESH_TOKEN_EXPIRY ?? "7d"),
    );
    return prisma.refreshToken.create({ data: { userId, expiresAt } });
  }

  async findById(id: string) {
    return prisma.refreshToken.findUnique({ where: { id } });
  }

  async revoke(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
