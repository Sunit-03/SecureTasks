import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureTasks API",
      version: "1.0.0",
      description: "SecureTasks Backend API Documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        SignupRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
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
          properties: {
            user: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },

                email: {
                  type: "string",
                },

                role: {
                  type: "string",
                },
              },
            },

            accessToken: {
              type: "string",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);