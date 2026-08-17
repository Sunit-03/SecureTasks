import bcrypt from "bcrypt";

import { TokenService } from "./token.services";
import { UserRepository } from "../repositories/user.repositories";
import { RefreshTokenRepository } from "../repositories/refresh-token.repositories";

const userRepository = new UserRepository();
const tokenService = new TokenService();
const refreshTokenRepository = new RefreshTokenRepository();

export class AuthService {
  private async issueTokens(userId: string, role: string) {
    const refreshRow = await refreshTokenRepository.create(userId);
    const accessToken = tokenService.generateAccessToken({ userId, role });
    const refreshToken = tokenService.generateRefreshToken({ userId, jti: refreshRow.id });
    return { accessToken, refreshToken };
  }

  async signup(email: string, password: string) {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      email,
      passwordHash,
    });

    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.role);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.role);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotates the refresh token on every use: the presented token is verified
   * (signature + expiry), matched against its DB row, then revoked and
   * replaced with a new row + new JWT. If a caller presents a token whose
   * row is *already* revoked, that's a replay of a token that should no
   * longer exist — treated as theft, so every active session for that user
   * is revoked.
   */
  async refreshSession(token: string) {
    let payload: { userId: string; jti: string };
    try {
      payload = tokenService.verifyRefreshToken(token) as { userId: string; jti: string };
    } catch {
      throw new Error("Invalid refresh token");
    }

    const row = await refreshTokenRepository.findById(payload.jti);

    if (!row || row.userId !== payload.userId) {
      throw new Error("Invalid refresh token");
    }

    if (row.revokedAt) {
      // Reuse of a rotated-out (or already-logged-out) token: possible theft.
      await refreshTokenRepository.revokeAllForUser(payload.userId);
      throw new Error("Invalid refresh token");
    }

    if (row.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }

    const user = await userRepository.findUserById(payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await refreshTokenRepository.revoke(row.id);
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.role);

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string | undefined) {
    if (!token) return;
    try {
      const payload = tokenService.verifyRefreshToken(token) as { jti: string };
      await refreshTokenRepository.revoke(payload.jti);
    } catch {
      // Token already invalid/expired — nothing to revoke, clearing the
      // cookie client-side is enough.
    }
  }
}
