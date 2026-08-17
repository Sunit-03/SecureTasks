const workflowStateSchemas = {
  WorkflowState: {
    type: "object",
    required: [
      "id",
      "projectId",
      "name",
      "color",
      "category",
      "order",
      "isDefault",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      projectId: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "In Review",
      },
      color: {
        type: "string",
        example: "#a1a1aa",
      },
      category: {
        type: "string",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        example: "IN_PROGRESS",
      },
      order: {
        type: "integer",
        example: 1,
      },
      isDefault: {
        type: "boolean",
        example: false,
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

  CreateWorkflowStateRequest: {
    type: "object",
    required: ["category"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        example: "In Review",
      },
      color: {
        type: "string",
        maxLength: 20,
        example: "#a1a1aa",
      },
      category: {
        type: "string",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        example: "IN_PROGRESS",
      },
      isDefault: {
        type: "boolean",
        default: false,
      },
    },
  },

  UpdateWorkflowStateRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 50,
      },
      color: {
        type: "string",
        maxLength: 20,
      },
      category: {
        type: "string",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
      },
      isDefault: {
        type: "boolean",
      },
    },
  },

  ReorderWorkflowStatesRequest: {
    type: "object",
    required: ["orderedIds"],
    properties: {
      orderedIds: {
        type: "array",
        minItems: 1,
        description:
          "Must contain every existing workflow-state id for the project exactly once, in the desired order.",
        items: {
          type: "string",
          format: "uuid",
        },
      },
    },
  },

  WorkflowStateResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        $ref: "#/components/schemas/WorkflowState",
      },
    },
  },

  WorkflowStateListResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/WorkflowState",
        },
      },
    },
  },
};

export default workflowStateSchemas;
