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

  UpdateMemberRoleRequest: {
    type: "object",
    required: ["role"],
    properties: {
      role: {
        type: "string",
        enum: ["ADMIN", "MEMBER", "VIEWER"],
        example: "MEMBER",
      },
    },
  },

  AuditLog: {
    type: "object",
    required: ["id", "action", "userId", "workspaceId", "createdAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      action: {
        type: "string",
        example: "project.created",
      },
      ipAddress: {
        type: "string",
        nullable: true,
      },
      metadata: {
        type: "object",
        nullable: true,
        additionalProperties: true,
      },
      userId: {
        type: "string",
        format: "uuid",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      user: {
        $ref: "#/components/schemas/WorkspaceMemberUserRef",
      },
    },
  },

  AuditLogListResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/AuditLog",
        },
      },
      total: {
        type: "integer",
        example: 1,
      },
      page: {
        type: "integer",
        example: 1,
      },
      limit: {
        type: "integer",
        example: 50,
      },
    },
  },
};

export default workspaceSchemas;