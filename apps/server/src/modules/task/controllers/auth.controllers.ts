import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      // console.log(req.body);
      // console.log(email, password);
      const result = await authService.signup(email, password);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "strict",
      });

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
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "strict",
      });

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

      res.json(session);
    } catch (error) {
      res.status(401).json({
        message: "Invalid refresh token",
      });
    }
  }

  async logout(_: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.json({
      message: "Logged out successfully",
    });
  }
}
