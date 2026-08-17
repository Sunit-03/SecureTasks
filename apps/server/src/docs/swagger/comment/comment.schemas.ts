const commentSchemas = {
  CommentAuthorRef: {
    type: "object",
    required: ["id", "email"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      email: {
        type: "string",
        format: "email",
        example: "teammate@example.com",
      },
    },
  },

  Comment: {
    type: "object",
    required: ["id", "content", "taskId", "authorId", "createdAt", "updatedAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      content: {
        type: "string",
        example: "Looks good to me!",
      },
      taskId: {
        type: "string",
        format: "uuid",
      },
      authorId: {
        type: "string",
        format: "uuid",
      },
      parentCommentId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      author: {
        $ref: "#/components/schemas/CommentAuthorRef",
      },
    },
  },

  CreateCommentRequest: {
    type: "object",
    required: ["content"],
    properties: {
      content: {
        type: "string",
        minLength: 1,
        maxLength: 5000,
        example: "Looks good to me!",
      },
      parentCommentId: {
        type: "string",
        format: "uuid",
        description: "Set to reply to an existing comment on the same task.",
      },
      mentionedUserIds: {
        type: "array",
        maxItems: 50,
        items: {
          type: "string",
          format: "uuid",
        },
      },
    },
  },

  CommentResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/Comment",
      },
    },
  },

  CommentListResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Comment",
        },
      },
    },
  },
};

export default commentSchemas;
