const notFound = {
  description: "Project not found",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const notMember = {
  description: "Caller is not a member of the project's workspace",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const notOwner = {
  description: "Caller is not the workspace owner",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const unauthorized = {
  description: "Authorization failed",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const validationFailed = {
  description: "Validation failed",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

const projectIdParam = {
  name: "projectId",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};

const stateIdParam = {
  name: "stateId",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};

const workflowStatePaths = {
  "/api/v1/projects/{projectId}/workflow-states": {
    get: {
      summary: "List workflow states for a project",
      tags: ["Workflow States"],
      security: [{ bearerAuth: [] }],
      parameters: [projectIdParam],
      responses: {
        200: {
          description: "Workflow states fetched successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkflowStateListResponse" },
            },
          },
        },
        401: unauthorized,
        403: notMember,
        404: notFound,
      },
    },

    post: {
      summary: "Create a workflow state",
      description:
        "Caller must be the workspace OWNER. New states are appended to the end of the order; setting isDefault clears the default flag on all other states in the project.",
      tags: ["Workflow States"],
      security: [{ bearerAuth: [] }],
      parameters: [projectIdParam],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateWorkflowStateRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Workflow state created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkflowStateResponse" },
            },
          },
        },
        400: validationFailed,
        401: unauthorized,
        403: notOwner,
        404: notFound,
      },
    },
  },

  "/api/v1/projects/{projectId}/workflow-states/reorder": {
    put: {
      summary: "Reorder a project's workflow states",
      description:
        "Caller must be the workspace OWNER. orderedIds must include every existing workflow-state id for the project exactly once.",
      tags: ["Workflow States"],
      security: [{ bearerAuth: [] }],
      parameters: [projectIdParam],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ReorderWorkflowStatesRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Workflow states reordered successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkflowStateListResponse" },
            },
          },
        },
        400: {
          description:
            "Validation failed, or orderedIds does not match the project's workflow-state id set exactly",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: unauthorized,
        403: notOwner,
        404: notFound,
      },
    },
  },

  "/api/v1/projects/{projectId}/workflow-states/{stateId}": {
    patch: {
      summary: "Update a workflow state",
      description:
        "Caller must be the workspace OWNER. Setting isDefault: true clears the default flag on all other states in the project.",
      tags: ["Workflow States"],
      security: [{ bearerAuth: [] }],
      parameters: [projectIdParam, stateIdParam],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateWorkflowStateRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Workflow state updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkflowStateResponse" },
            },
          },
        },
        400: validationFailed,
        401: unauthorized,
        403: notOwner,
        404: {
          description: "Workflow state not found in this project",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    delete: {
      summary: "Delete a workflow state",
      description:
        "Caller must be the workspace OWNER. Fails if this is the project's last remaining state, or if tasks are still assigned to it. If the deleted state was the default, the first remaining state is promoted to default.",
      tags: ["Workflow States"],
      security: [{ bearerAuth: [] }],
      parameters: [projectIdParam, stateIdParam],
      responses: {
        200: {
          description: "Workflow state deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        400: {
          description: "A project must have at least one workflow status",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: unauthorized,
        403: notOwner,
        404: {
          description: "Workflow state not found in this project",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        409: {
          description: "Tasks are still assigned to this workflow state",
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

export default workflowStatePaths;
