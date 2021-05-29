import express from 'express';

import taskRoutes from './taskRoutes';

import { auth } from '../services/authService';
import { findUserByEmail } from '../services/userService';
import { findProjectById, findProjectsByUserId } from '../services/projectService';

import { createProjectDataValidator, addUserInProjectDataValidator } from '../validators/projectValidators';

import { getProjects, createProject, addUserInProject } from '../controllers/projectController';

const router = express.Router();

/**
 * Get projects of a user.
 * GET api/v1/projects.
 */
router.get('/', auth, findProjectsByUserId, getProjects);

/**
 * Create a new project for a user.
 * POST api/v1/projects.
 */
router.post('/', createProjectDataValidator, auth, createProject);

/**
 * Add a new member in a project.
 * PUT api/v1/projects/:projectId/members.
 */
router.put('/:projectId/members', addUserInProjectDataValidator, auth, findUserByEmail, findProjectById, addUserInProject);

/**
 * Routes for tasks of a project.
 */
router.use('/', taskRoutes);

export default router;
