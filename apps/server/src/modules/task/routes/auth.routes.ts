import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers";

const router = Router();

const authController = new AuthController();

router.post(
  "/signup",
  authController.signup.bind(authController)
);

router.post(
  "/login",
  authController.login.bind(authController)
);

router.post(
  "/refresh",
  authController.refresh.bind(authController)
);

router.post(
  "/logout",
  authController.logout.bind(authController)
);

export default router;