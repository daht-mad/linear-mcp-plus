import { isCreateDocumentArgs } from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

export function handleCreateDocument(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateDocumentArgs(args)) {
        throw new Error('Invalid arguments for documentCreate');
      }

      return await linearService.createDocument(args);
    } catch (error) {
      logError('Error creating document', error);
      throw error;
    }
  };
}
