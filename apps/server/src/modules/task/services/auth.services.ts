import bcrypt from "bcrypt";

// import { UserRepository } from "../task/repositories/user.repositories";
import { TokenService } from "./token.services";
import { UserRepository } from "../repositories/user.repositories";

const userRepository = new UserRepository();
const tokenService = new TokenService();

export class AuthService {
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

    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = tokenService.generateRefreshToken({ userId: user.id });
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

    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = tokenService.generateRefreshToken({ userId: user.id });
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshSession(token: string) {
    try {
      const payload = tokenService.verifyRefreshToken(token) as {
        userId: string;
      };
      const user = await userRepository.findUserById(payload.userId);

      if (!user) {
        throw new Error("User not found");
      }

      const newAccessToken = tokenService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });
      const safeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        user: safeUser,
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
