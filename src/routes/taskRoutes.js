import express from 'express';

import { auth } from '../services/authService';

import { verifyUserIsProjectMember } from '../services/projectService';

import { createTask, getTasks, deleteTask } from '../controllers/taskController';

import { createTaskDataValidator, getTasksDataValidator, deleteTaskDataValidator } from '../validators/taskValidators';

const router = express.Router();

// Create task
router.post('/:projectId/tasks', createTaskDataValidator, auth, verifyUserIsProjectMember, createTask);

// Get tasks of a project
router.get('/:projectId/tasks', getTasksDataValidator, auth, verifyUserIsProjectMember, getTasks);

// Delete a task from a project
router.delete('/:projectId/tasks', deleteTaskDataValidator, auth, verifyUserIsProjectMember, deleteTask);

export default router;
