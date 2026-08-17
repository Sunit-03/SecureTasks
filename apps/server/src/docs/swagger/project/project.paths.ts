const projectIdParameter = {
  name: "projectId",
  in: "path",
  required: true,
  schema: {
    type: "string",
    format: "uuid",
  },
};

const workspaceIdParameter = {
  name: "workspaceId",
  in: "path",
  required: true,
  schema: {
    type: "string",
    format: "uuid",
  },
};

const projectPaths = {
  "/api/v1/projects": {
    post: {
      summary: "Create a project in a workspace",
      description: "Caller must already be a member of the target workspace.",
      tags: ["Projects"],
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
              $ref: "#/components/schemas/CreateProjectRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Project created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectResponse" },
            },
          },
        },
        400: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Caller is not a member of this workspace",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/projects/workspace/{workspaceId}": {
    get: {
      summary: "List projects in a workspace",
      description: "Caller must already be a member of the workspace.",
      tags: ["Projects"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [workspaceIdParameter],
      responses: {
        200: {
          description: "Projects returned successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectListResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Caller is not a member of this workspace",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/projects/{projectId}": {
    patch: {
      summary: "Update a project",
      description:
        "workspaceId must be included in the body for the membership check to resolve (see UpdateProjectRequest). The route does not run schema validation on the body.",
      tags: ["Projects"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [projectIdParameter],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProjectRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Project updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Caller is not a member of this workspace (or workspaceId was omitted from the body)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Project not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    delete: {
      summary: "Delete a project",
      description:
        "workspaceId must be included in the request body for the membership check to resolve (see DeleteProjectRequest).",
      tags: ["Projects"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [projectIdParameter],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/DeleteProjectRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Project deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Caller is not a member of this workspace (or workspaceId was omitted from the body)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Project not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};

export { projectPaths };
export default projectPaths;
