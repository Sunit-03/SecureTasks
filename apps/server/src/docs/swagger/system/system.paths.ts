const systemPaths = {
  "/": {
    get: {
      summary: "Get API status message",
      tags: ["System"],
      responses: {
        200: {
          description: "API status message returned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RootResponse",
              },
            },
          },
        },
      },
    },
  },
  "/health": {
    get: {
      summary: "Get service health status",
      description:
        "Unauthenticated liveness/readiness probe. Reports database connectivity only — does not return any user or application data.",
      tags: ["System"],
      responses: {
        200: {
          description: "Service is healthy and the database is reachable",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthResponse",
              },
            },
          },
        },
        503: {
          description: "Database is unreachable",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/profile": {
    get: {
      summary: "Get authenticated user profile payload",
      tags: ["Users"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Authenticated user payload returned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProfileResponse",
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
      },
    },
  },
  "/api/v1/admin": {
    get: {
      summary: "Get admin-only welcome message",
      tags: ["Admin"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Admin route accessed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdminMessageResponse",
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
          description: "Authenticated user lacks the required role",
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

export { systemPaths };
export default systemPaths;
