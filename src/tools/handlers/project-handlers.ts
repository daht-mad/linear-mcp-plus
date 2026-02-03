import {
  isAddIssueToProjectArgs,
  isCreateProjectArgs,
  isGetProjectIssuesArgs,
  isUpdateProjectArgs,
  isProjectUpdateCreateInput,
  isUpdateProjectLeadArgs,
  isGetProjectUpdatesArgs,
} from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting projects
 */
export function handleGetProjects(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      return await linearService.getProjects();
    } catch (error) {
      logError('Error getting projects', error);
      throw error;
    }
  };
}

/**
 * Handler for creating a project
 */
export function handleCreateProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isCreateProjectArgs(args)) {
        throw new Error('Invalid arguments for createProject');
      }

      return await linearService.createProject(args);
    } catch (error) {
      logError('Error creating project', error);
      throw error;
    }
  };
}

/**
 * Handler for updating a project
 */
export function handleUpdateProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateProjectArgs(args)) {
        throw new Error('Invalid arguments for updateProject');
      }

      return await linearService.updateProject(args);
    } catch (error) {
      logError('Error updating project', error);
      throw error;
    }
  };
}

/**
 * Handler for adding an issue to a project
 */
export function handleAddIssueToProject(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueToProjectArgs(args)) {
        throw new Error('Invalid arguments for addIssueToProject');
      }

      return await linearService.addIssueToProject(args.issueId, args.projectId);
    } catch (error) {
      logError('Error adding issue to project', error);
      throw error;
    }
  };
}

/**
 * Handler for getting issues in a project
 */
export function handleGetProjectIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectIssuesArgs(args)) {
        throw new Error('Invalid arguments for getProjectIssues');
      }

      return await linearService.getProjectIssues(args.projectId, args.limit);
    } catch (error) {
      logError('Error getting project issues', error);
      throw error;
    }
  };
}

/**
 * Handler for creating a project update
 */
export function handleProjectUpdateCreate(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isProjectUpdateCreateInput(args)) {
        throw new Error('Invalid arguments for projectUpdateCreate');
      }

      const result = await linearService.createProjectUpdate({
        projectId: args.projectId,
        body: args.body,
        health: args.health,
      });

      return {
        success: true,
        projectUpdate: {
          id: result.id,
          url: result.project.id,
        },
      };
    } catch (error) {
      logError('Error creating project update', error);
      throw error;
    }
  };
}

/**
 * Handler for updating a project's lead
 */
export function handleUpdateProjectLead(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isUpdateProjectLeadArgs(args)) {
        throw new Error('Invalid arguments for updateProjectLead');
      }

      return await linearService.updateProjectLead(args.projectId, args.leadId);
    } catch (error) {
      logError('Error updating project lead', error);
      throw error;
    }
  };
}

export function handleGetProjectUpdates(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetProjectUpdatesArgs(args)) {
        throw new Error('Invalid arguments for getProjectUpdates');
      }

      return await linearService.getProjectUpdates(args.projectId, args.limit);
    } catch (error) {
      logError('Error getting project updates', error);
      throw error;
    }
  };
}
