const taskIdParameter = {
  name: "id",
  in: "path",
  required: true,
  description: "Task ID",
  schema: {
    type: "string",
    format: "uuid",
  },
};

const taskStatusQueryParam = {
  name: "status",
  in: "query",
  required: false,
  description: "Filter by task status",
  schema: {
    type: "string",
    enum: ["TODO", "IN_PROGRESS", "DONE"],
  },
};

const taskWorkspaceIdQueryParam = {
  name: "workspaceId",
  in: "query",
  required: false,
  description: "Restrict results to tasks whose project belongs to this workspace.",
  schema: {
    type: "string",
    format: "uuid",
  },
};

const taskPageQueryParam = {
  name: "page",
  in: "query",
  required: false,
  description: "1-indexed page number",
  schema: {
    type: "integer",
    default: 1,
  },
};

const taskLimitQueryParam = {
  name: "limit",
  in: "query",
  required: false,
  description: "Page size",
  schema: {
    type: "integer",
    default: 10,
  },
};

const taskPaths = {
  "/api/v1/tasks": {
    post: {
      summary: "Create a task in a project",
      description:
        "The caller must be a member of the target project's workspace, or this returns 403.",
      tags: ["Tasks"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTaskRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        400: {
          description: "Task creation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Caller is not a member of the project's workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Project not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    get: {
      summary: "List tasks visible to the authenticated user",
      description:
        "Returns tasks belonging to projects in any workspace the caller is a member of (not just tasks the caller created).",
      tags: ["Tasks"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        taskWorkspaceIdQueryParam,
        taskStatusQueryParam,
        taskPageQueryParam,
        taskLimitQueryParam,
      ],
      responses: {
        200: {
          description: "Tasks returned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskListResponse",
              },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Failed to fetch tasks",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/tasks/{id}": {
    get: {
      summary: "Get a task by ID",
      description: "The caller must be a member of the task's project's workspace.",
      tags: ["Tasks"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [taskIdParameter],
      responses: {
        200: {
          description: "Task returned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Caller is not a member of the task's workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    patch: {
      summary: "Update a task",
      description: "The caller must be a member of the task's project's workspace.",
      tags: ["Tasks"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [taskIdParameter],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTaskRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Task updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        400: {
          description: "Task update failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description:
            "Caller is not a member of the task's workspace, or is a plain member trying to edit `description` (creator or workspace OWNER only)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Delete a task",
      description: "The caller must be a member of the task's project's workspace.",
      tags: ["Tasks"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [taskIdParameter],
      responses: {
        200: {
          description: "Task deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Caller is not a member of the task's workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};

export { taskPaths };
export default taskPaths;
