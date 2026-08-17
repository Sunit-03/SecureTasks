const workspaceSchemas = {
  Workspace: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Engineering Workspace",
      },

      ownerId: {
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

  CreateWorkspaceRequest: {
    type: "object",

    required: ["name"],

    properties: {
      name: {
        type: "string",
        example: "Engineering Workspace",
      },
    },
  },

  WorkspaceResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: true,
      },

      data: {
        $ref:
          "#/components/schemas/Workspace",
      },
    },
  },

  WorkspaceListResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: true,
      },

      data: {
        type: "array",

        items: {
          $ref:
            "#/components/schemas/Workspace",
        },
      },
    },
  },

  WorkspaceMemberUserRef: {
    type: "object",
    required: ["id", "email"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      email: {
        type: "string",
        format: "email",
        example: "teammate@example.com",
      },
    },
  },

  WorkspaceMember: {
    type: "object",
    required: ["id", "userId", "workspaceId", "role", "createdAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      userId: {
        type: "string",
        format: "uuid",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
      },
      role: {
        type: "string",
        enum: ["OWNER", "ADMIN", "MEMBER"],
        example: "MEMBER",
      },
      user: {
        $ref: "#/components/schemas/WorkspaceMemberUserRef",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  AddMemberRequest: {
    type: "object",
    required: ["email", "role"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Must belong to an existing registered user.",
        example: "teammate@example.com",
      },
      role: {
        type: "string",
        enum: ["ADMIN", "MEMBER"],
        example: "MEMBER",
      },
    },
  },

  WorkspaceMemberResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/WorkspaceMember",
      },
    },
  },

  WorkspaceMemberListResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/WorkspaceMember",
        },
      },
    },
  },
};

export default workspaceSchemas;