const pageParam = {
  name: "page",
  in: "query",
  required: false,
  schema: { type: "integer", minimum: 1, default: 1 },
};

const limitParam = {
  name: "limit",
  in: "query",
  required: false,
  schema: { type: "integer", minimum: 1, maximum: 100, default: 50 },
};

const forbiddenResponse = {
  description:
    "Authenticated user is not a platform admin — requires both Role.ADMIN " +
    "and an email matching ADMIN_DOMAIN or the ADMIN_EMAIL_EXCEPTIONS allowlist.",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const unauthorizedResponse = {
  description: "Authorization failed",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const adminPaths = {
  "/api/v1/admin/users": {
    get: {
      summary: "List all users across the platform",
      description:
        "Platform-admin only. Not scoped to any workspace — lists every user regardless of workspace membership.",
      tags: ["Admin"],
      security: [{ bearerAuth: [] }],
      parameters: [pageParam, limitParam],
      responses: {
        200: {
          description: "Users fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminUserListResponse" },
            },
          },
        },
        401: unauthorizedResponse,
        403: forbiddenResponse,
      },
    },
  },

  "/api/v1/admin/workspaces": {
    get: {
      summary: "List all workspaces across the platform",
      description:
        "Platform-admin only. Not scoped to caller membership — lists every workspace regardless of whether the admin belongs to it.",
      tags: ["Admin"],
      security: [{ bearerAuth: [] }],
      parameters: [pageParam, limitParam],
      responses: {
        200: {
          description: "Workspaces fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminWorkspaceListResponse" },
            },
          },
        },
        401: unauthorizedResponse,
        403: forbiddenResponse,
      },
    },
  },

  "/api/v1/admin/audit-log": {
    get: {
      summary: "List the global audit log across all workspaces",
      description:
        "Platform-admin only. The per-workspace audit log endpoint " +
        "(`/api/v1/workspaces/{workspaceId}/audit-log`) is restricted to that " +
        "workspace's owner; this is the cross-tenant equivalent.",
      tags: ["Admin"],
      security: [{ bearerAuth: [] }],
      parameters: [pageParam, limitParam],
      responses: {
        200: {
          description: "Audit log entries fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminAuditLogListResponse" },
            },
          },
        },
        401: unauthorizedResponse,
        403: forbiddenResponse,
      },
    },
  },
};

export default adminPaths;
