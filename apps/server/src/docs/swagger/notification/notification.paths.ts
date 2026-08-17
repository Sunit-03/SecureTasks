const notificationPaths = {
  "/api/v1/notifications": {
    get: {
      summary: "List notifications for the authenticated user",
      tags: ["Notifications"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1, default: 20 },
        },
      ],
      responses: {
        200: {
          description: "Notifications fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NotificationListResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/notifications/read-all": {
    patch: {
      summary: "Mark all notifications as read",
      tags: ["Notifications"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "All notifications marked as read",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/notifications/{id}/read": {
    patch: {
      summary: "Mark a single notification as read",
      description:
        "No-op (still returns 200) if the notification does not exist or does not belong to the caller.",
      tags: ["Notifications"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Notification marked as read",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        401: {
          description: "Authorization failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};

export default notificationPaths;
