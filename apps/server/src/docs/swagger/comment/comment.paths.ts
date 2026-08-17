const commentPaths = {
  "/api/v1/tasks/{taskId}/comments": {
    get: {
      summary: "List comments on a task",
      description:
        "Returns a flat, chronologically-ordered list. Replies are comments with a non-null parentCommentId; clients build the thread tree.",
      tags: ["Comments"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Comments fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentListResponse" },
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
        403: {
          description: "Caller is not a member of the task's workspace",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    post: {
      summary: "Add a comment to a task",
      description:
        "Viewers cannot post comments. Replying to another author's comment notifies them (COMMENT_REPLY); mentioned workspace members are notified (MENTIONED).",
      tags: ["Comments"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCommentRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Comment created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentResponse" },
            },
          },
        },
        400: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
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
        403: {
          description: "Caller is not a member of the task's workspace, or is a VIEWER",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Task not found, or parentCommentId does not belong to this task",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/api/v1/tasks/{taskId}/comments/{commentId}": {
    delete: {
      summary: "Delete a comment",
      description:
        "Only the comment author or a workspace ADMIN+ may delete. Deleting a top-level comment cascades to its replies.",
      tags: ["Comments"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
        {
          name: "commentId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Comment deleted successfully",
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
        403: {
          description: "Caller is neither the comment author nor a workspace ADMIN+",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Comment not found",
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

export default commentPaths;
