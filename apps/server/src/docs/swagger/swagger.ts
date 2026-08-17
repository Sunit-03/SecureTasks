import swaggerJsdoc from "swagger-jsdoc";

import authPaths from "./auth/auth.paths";
import authSchemas from "./auth/auth.schemas";
import systemPaths from "./system/system.paths";
import commonSchemas from "./common/common.schemas";
import taskPaths from "./task/task.paths";
import taskSchemas from "./task/task.schemas";
import workspacePaths from "./workspace/workspace.paths";
import workspaceSchemas from "./workspace/workspace.schemas";
import projectPaths from "./project/project.paths";
import projectSchemas from "./project/project.schemas";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureTasks API",
      version: "1.0.0",
      description: "SecureTasks backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Development server",
        variables: {
          port: {
            default: "5000",
          },
        },
      },
    ],
    tags: [
      {
        name: "System",
      },
      {
        name: "Auth",
      },
      {
        name: "Users",
      },
      {
        name: "Admin",
      },
      {
        name: "Tasks",
      },
      {
        name: "Workspaces",
      },
      {
        name: "Projects",
      },
    ],
    paths: {
      ...systemPaths,
      ...authPaths,
      ...taskPaths,
      ...workspacePaths,
      ...projectPaths,
    },
    components: {
      schemas: {
        ...commonSchemas,
        ...authSchemas,
        ...taskSchemas,
        ...workspaceSchemas,
        ...projectSchemas,

      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        refreshTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
