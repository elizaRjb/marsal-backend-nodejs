import express from 'express';

import { auth } from '../services/authService';

import { verifyUserIsProjectMember } from '../services/projectService';

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  addComment,
  getTaskDetails
} from '../controllers/taskController';

import {
  getTasksDataValidator,
  createTaskDataValidator,
  deleteTaskDataValidator,
  updateTaskDataValidator,
  addCommentDataValidator,
  getTaskDetailsDataValidator
} from '../validators/taskValidators';

const router = express.Router();

/**
 * Create a task.
 * POST api/v1/projects/:projectId/tasks.
 */
router.post('/:projectId/tasks', createTaskDataValidator, auth, verifyUserIsProjectMember, createTask);

/**
 * Get tasks of a project.
 * GET api/v1/projects/:projectId/tasks.
 */
router.get('/:projectId/tasks', getTasksDataValidator, auth, verifyUserIsProjectMember, getTasks);

/**
 * Delete a task from a project.
 * DELETE api/v1/projects/:projectId/tasks.
 */
router.delete('/:projectId/tasks', deleteTaskDataValidator, auth, verifyUserIsProjectMember, deleteTask);

/**
 * Update a task of a project.
 * PUT api/v1/projects/:projectId/tasks/:taskId.
 */
router.put('/:projectId/tasks/:taskId', updateTaskDataValidator, auth, verifyUserIsProjectMember, updateTask);

/**
 * Get details of a task of a project.
 * GET api/v1/projects/:projectId/tasks/:taskId.
 */
router.get('/:projectId/tasks/:taskId', getTaskDetailsDataValidator, auth, verifyUserIsProjectMember, getTaskDetails);

/**
 * Add a comment to the task of a project.
 * PUT api/v1/projects/:projectId/tasks/:taskId/comments.
 */
router.put('/:projectId/tasks/:taskId/comments', addCommentDataValidator, auth, verifyUserIsProjectMember, addComment);

export default router;
