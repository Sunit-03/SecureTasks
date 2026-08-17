import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";

const authService = new AuthService();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Set to true in production with HTTPS
  sameSite: "strict" as const,
};

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.signup(email, password);
      res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

      const safeUser = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      };

      res.json({
        user: safeUser,
        accessToken: result.accessToken,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Signup failed",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);
      res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

      const safeUser = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      };

      res.json({
        user: safeUser,
        accessToken: result.accessToken,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: "No refresh token provided",
        });
      }

      const session = await authService.refreshSession(refreshToken);

      // Rotation: every successful refresh issues (and cookies) a new
      // refresh token, invalidating the one that was just presented.
      res.cookie("refreshToken", session.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({ user: session.user, accessToken: session.accessToken });
    } catch (error) {
      res.status(401).json({
        message: "Invalid refresh token",
      });
    }
  }

  async logout(req: Request, res: Response) {
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.json({
      message: "Logged out successfully",
    });
  }
}
