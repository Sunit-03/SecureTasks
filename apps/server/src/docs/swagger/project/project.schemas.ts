const projectSchemas = {
  Project: {
    type: "object",
    required: ["id", "name", "workspaceId", "createdAt", "updatedAt"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Website Redesign",
      },
      description: {
        type: "string",
        nullable: true,
        example: "Rebuild the marketing site on the new design system.",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
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
  CreateProjectRequest: {
    type: "object",
    required: ["name", "workspaceId"],
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Website Redesign",
      },
      description: {
        type: "string",
        maxLength: 500,
        example: "Rebuild the marketing site on the new design system.",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
        description: "Caller must already be a member of this workspace.",
      },
    },
  },
  UpdateProjectRequest: {
    type: "object",
    description:
      "The PATCH route does not run body validation, so both fields are optional in practice. workspaceId must also be included — the route has no :workspaceId path param, so the membership check reads it from the body.",
    required: ["workspaceId"],
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Website Redesign v2",
      },
      description: {
        type: "string",
        maxLength: 500,
        example: "Rebuild the marketing site on the new design system.",
      },
      workspaceId: {
        type: "string",
        format: "uuid",
        description:
          "Required for the membership check to succeed, even though this is not a schema-validated field.",
      },
    },
  },
  DeleteProjectRequest: {
    type: "object",
    description:
      "Sent as a request body on DELETE. Required for the membership check to succeed, since the route has no :workspaceId path param.",
    required: ["workspaceId"],
    properties: {
      workspaceId: {
        type: "string",
        format: "uuid",
      },
    },
  },
  ProjectResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/Project",
      },
    },
  },
  ProjectListResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Project",
        },
      },
    },
  },
};

export { projectSchemas };
export default projectSchemas;
