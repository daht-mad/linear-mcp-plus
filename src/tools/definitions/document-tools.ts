import { MCPToolDefinition } from '../../types.js';

/**
 * Tool definition for creating a document
 */
export const createDocumentToolDefinition: MCPToolDefinition = {
  name: 'linear_documentCreate',
  description: 'Create a new document in Linear',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the document',
      },
      content: {
        type: 'string',
        description: 'Content of the document (Markdown supported)',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project to associate the document with (optional)',
      },
    },
    required: ['title', 'content'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      document: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
        },
      },
    },
  },
};
