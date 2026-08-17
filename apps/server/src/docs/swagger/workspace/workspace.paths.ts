const workspacePaths = {
  "/api/v1/workspaces": {
    post: {
      summary: "Create workspace",

      tags: ["Workspaces"],

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
              $ref:
                "#/components/schemas/CreateWorkspaceRequest",
            },
          },
        },
      },

      responses: {
        201: {
          description:
            "Workspace created successfully",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/WorkspaceResponse",
              },
            },
          },
        },
      },
    },

    get: {
      summary:
        "Get user workspaces",

      tags: ["Workspaces"],

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description:
            "Workspaces fetched successfully",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/WorkspaceListResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/v1/workspaces/{workspaceId}/members": {
    post: {
      summary: "Invite a member to a workspace",
      description:
        "Caller must already be a member of the workspace. The invitee must be an existing registered user (looked up by email) and must not already be a member, or this returns 409.",
      tags: ["Workspaces"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "workspaceId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddMemberRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Member added successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/WorkspaceMemberResponse",
              },
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
        404: {
          description: "No registered user exists with the given email",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        409: {
          description: "The user is already a member of this workspace",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    get: {
      summary: "List members of a workspace",
      description: "Caller must already be a member of the workspace.",
      tags: ["Workspaces"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "workspaceId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Members fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/WorkspaceMemberListResponse",
              },
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
};

export default workspacePaths;