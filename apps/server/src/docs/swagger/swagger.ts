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
import commentPaths from "./comment/comment.paths";
import commentSchemas from "./comment/comment.schemas";
import notificationPaths from "./notification/notification.paths";
import notificationSchemas from "./notification/notification.schemas";
import workflowStatePaths from "./workflow-state/workflow-state.paths";
import workflowStateSchemas from "./workflow-state/workflow-state.schemas";
import adminPaths from "./admin/admin.paths";
import adminSchemas from "./admin/admin.schemas";

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
      {
        name: "Comments",
      },
      {
        name: "Notifications",
      },
      {
        name: "Workflow States",
      },
    ],
    paths: {
      ...systemPaths,
      ...authPaths,
      ...taskPaths,
      ...workspacePaths,
      ...projectPaths,
      ...commentPaths,
      ...notificationPaths,
      ...workflowStatePaths,
      ...adminPaths,
    },
    components: {
      schemas: {
        ...commonSchemas,
        ...authSchemas,
        ...taskSchemas,
        ...workspaceSchemas,
        ...projectSchemas,
        ...commentSchemas,
        ...notificationSchemas,
        ...workflowStateSchemas,
        ...adminSchemas,
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
