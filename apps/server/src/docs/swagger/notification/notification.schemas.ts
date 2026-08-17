const notificationSchemas = {
  Notification: {
    type: "object",
    required: ["id", "type", "message", "userId", "read", "createdAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      type: {
        type: "string",
        enum: [
          "TASK_ASSIGNED",
          "SUBTASK_LINKED",
          "PRIORITY_CHANGED",
          "COMMENT_REPLY",
          "MENTIONED",
        ],
        example: "TASK_ASSIGNED",
      },
      message: {
        type: "string",
        example: "You were assigned to \"Fix login bug\"",
      },
      userId: {
        type: "string",
        format: "uuid",
      },
      taskId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
      read: {
        type: "boolean",
        example: false,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  NotificationListResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Notification",
        },
      },
      unreadCount: {
        type: "integer",
        example: 3,
      },
    },
  },
};

export default notificationSchemas;
