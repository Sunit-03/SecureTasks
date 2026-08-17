const authPaths = {
  "/api/v1/auth/signup": {
    post: {
      summary: "Register a new user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SignupRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        400: {
          description: "Signup failed",
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
  "/api/v1/auth/login": {
    post: {
      summary: "Login user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        400: {
          description: "Login failed",
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
  "/api/v1/auth/refresh": {
    post: {
      summary: "Refresh access token",
      tags: ["Auth"],
      security: [
        {
          refreshTokenCookie: [],
        },
      ],
      responses: {
        200: {
          description: "Access token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshTokenResponse",
              },
            },
          },
        },
        401: {
          description: "Refresh token is missing or invalid",
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
  "/api/v1/auth/logout": {
    post: {
      summary: "Logout user",
      tags: ["Auth"],
      responses: {
        200: {
          description: "User logged out successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },
};

export { authPaths };
export default authPaths;
