const authSchemas = {
  SignupRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "test@example.com",
      },
      password: {
        type: "string",
        example: "12345678",
      },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "test@example.com",
      },
      password: {
        type: "string",
        example: "12345678",
      },
    },
  },
  AuthResponse: {
    type: "object",
    required: ["user", "accessToken"],
    properties: {
      user: {
        $ref: "#/components/schemas/UserRecord",
      },
      accessToken: {
        type: "string",
      },
    },
  },
  RefreshTokenResponse: {
    type: "object",
    required: ["accessToken"],
    properties: {
      accessToken: {
        $ref: "#/components/schemas/AccessTokenResponse",
      },
    },
  },
};

export { authSchemas };
export default authSchemas;
