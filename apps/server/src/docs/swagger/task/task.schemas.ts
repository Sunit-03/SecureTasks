const taskSchemas = {
  TaskProjectRef: {
    type: "object",
    description: "Minimal project info included on a task record.",
    required: ["id", "name", "workspaceId"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Website Redesign",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
      },
    },
  },
  TaskRecord: {
    type: "object",
    required: ["id", "title", "status", "priority", "projectId", "createdById", "createdAt", "updatedAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      title: {
        type: "string",
        example: "Finish Swagger docs",
      },
      description: {
        type: "string",
        nullable: true,
        description: "Sanitized rich-text HTML (bold/italic/underline/lists only).",
        example: "<p>Add missing protected task routes to the OpenAPI spec.</p>",
      },
      status: {
        type: "string",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        example: "TODO",
      },
      priority: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        example: "MEDIUM",
      },
      projectId: {
        type: "string",
        format: "uuid",
      },
      project: {
        $ref: "#/components/schemas/TaskProjectRef",
      },
      createdById: {
        type: "string",
        format: "uuid",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateTaskRequest: {
    type: "object",
    required: ["title", "projectId"],
    properties: {
      title: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Finish Swagger docs",
      },
      description: {
        type: "string",
        maxLength: 10000,
        description: "Rich-text HTML from the client editor; sanitized server- and client-side before display.",
        example: "<p>Add missing protected task routes to the OpenAPI spec.</p>",
      },
      projectId: {
        type: "string",
        format: "uuid",
        description: "Project the task is created under. The caller must be a member of this project's workspace.",
      },
      priority: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        default: "MEDIUM",
        example: "MEDIUM",
      },
    },
  },
  UpdateTaskRequest: {
    type: "object",
    description:
      "Editing `description` is restricted: only the task's creator or a workspace member with role OWNER may set it (403 otherwise). title/status/priority can be changed by any workspace member.",
    properties: {
      title: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Review task routes",
      },
      description: {
        type: "string",
        maxLength: 10000,
        description: "Rich-text HTML. Creator or workspace OWNER only — see schema description.",
        example: "<p>Confirm request and response shapes match the controllers.</p>",
      },
      status: {
        type: "string",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        example: "IN_PROGRESS",
      },
      priority: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        example: "HIGH",
      },
    },
  },
  TaskResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/TaskRecord",
      },
    },
  },
  TaskListResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/TaskRecord",
        },
      },
    },
  },
};

export { taskSchemas };
export default taskSchemas;
