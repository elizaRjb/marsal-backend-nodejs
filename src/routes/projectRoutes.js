import express from 'express';

import taskRoutes from './taskRoutes';

import { auth } from '../services/authService';
import { findUserByEmail } from '../services/userService';
import { findProjectById, findProjectsByUserId } from '../services/projectService';

import { getProjectsDataValidator, createProjectDataValidator, addUserInProjectDataValidator } from '../validators/projectValidators';

import { getProjects, createProject, addUserInProject } from '../controllers/projectController';

const router = express.Router();

// Get projects
router.get('/:userId/projects', getProjectsDataValidator, auth, findProjectsByUserId, getProjects);

// Create project
router.post('/:userId/add-project', createProjectDataValidator, auth, createProject);

// Add new member in a project
router.put('/:projectId/add-member', addUserInProjectDataValidator, auth, findUserByEmail, findProjectById, addUserInProject);

router.use('/', taskRoutes);

export default router;
