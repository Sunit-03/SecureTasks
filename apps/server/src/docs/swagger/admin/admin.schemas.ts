const adminSchemas = {
  AdminUserRecord: {
    type: "object",
    required: ["id", "email", "role", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      email: { type: "string", format: "email" },
      role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  AdminUserListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/AdminUserRecord" },
      },
      total: { type: "integer", example: 42 },
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 50 },
    },
  },

  AdminWorkspaceRecord: {
    type: "object",
    required: ["id", "name", "ownerId", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      ownerId: { type: "string", format: "uuid" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  AdminWorkspaceListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/AdminWorkspaceRecord" },
      },
      total: { type: "integer", example: 12 },
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 50 },
    },
  },

  AdminAuditLogListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/AuditLog" },
      },
      total: { type: "integer", example: 128 },
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 50 },
    },
  },
};

export default adminSchemas;
