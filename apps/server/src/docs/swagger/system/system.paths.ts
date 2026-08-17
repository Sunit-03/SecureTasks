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
      summary: "Get health check details",
      tags: ["System"],
      responses: {
        200: {
          description: "Health check data returned successfully",
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
