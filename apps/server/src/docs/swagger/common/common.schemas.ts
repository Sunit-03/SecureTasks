const commonSchemas = {
  ErrorResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "Invalid Credentials",
      },
    },
  },
  MessageResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "Logged out successfully",
      },
    },
  },
  RootResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "SecureTasks API Running",
      },
    },
  },
  UserRecord: {
    type: "object",
    required: ["id", "email", "passwordHash", "role", "createdAt", "updatedAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      email: {
        type: "string",
        format: "email",
        example: "test@example.com",
      },
      passwordHash: {
        type: "string",
        example: "$2b$10$abcdefghijklmnopqrstuv",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
        example: "USER",
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
  AccessTokenResponse: {
    type: "object",
    required: ["accessToken"],
    properties: {
      accessToken: {
        type: "string",
      },
    },
  },
  AuthenticatedUserContext: {
    type: "object",
    required: ["userId", "role"],
    properties: {
      userId: {
        type: "string",
        format: "uuid",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
        example: "USER",
      },
    },
  },
  ProfileResponse: {
    type: "object",
    required: ["user"],
    properties: {
      user: {
        $ref: "#/components/schemas/AuthenticatedUserContext",
      },
    },
  },
  HealthResponse: {
    type: "object",
    required: ["success", "status", "database", "timestamp"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      status: {
        type: "string",
        enum: ["ok", "error"],
        example: "ok",
      },
      database: {
        type: "string",
        enum: ["connected", "unreachable"],
        example: "connected",
      },
      timestamp: {
        type: "string",
        format: "date-time",
      },
    },
  },
};

export { commonSchemas };
export default commonSchemas;
