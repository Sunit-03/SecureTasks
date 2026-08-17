import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import prisma from "./config/prisma";
import authRoutes from "./modules/task/routes/auth.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger/swagger";
import cookieParser from "cookie-parser";
import { authMiddleware, AuthRequest } from "./middleware/auth.middleware";
import { requiredRole } from "./middleware/role.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import taskRoutes from "./modules/task/routes/task.routes";
import morgan from "morgan";
import { apiRateLimiter } from "./config/rate-limit";
import workspaceRoutes from "./modules/workspace/routes/workspace.routes";
import projectRoutes from "./modules/projects/routes/project.routes";

const app = express();
app.use(express.json());
const PORT = process.env.PORT; // ||5000

app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(helmet());
app.use(morgan("dev"));
app.use(apiRateLimiter);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({
    message: "SecureTasks API Running",
  });
});

app.get("/health", async (_, res) => {
  const users = await prisma.user.findMany();

  res.json({
    success: true,
    users,
  });
});

app.use("/api/v1/auth", authRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/profile", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    user: req.user,
  });
});

app.get("/admin", authMiddleware, requiredRole("ADMIN"), (_,res) => {
  res.json({
    message: "Welcome, Admin!",
  });
});

app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});