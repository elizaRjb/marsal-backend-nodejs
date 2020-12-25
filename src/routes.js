import { Router } from 'express';

import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';

/**
 * Contains all API routes for the application.
 */
const router = Router();

router.use('/users', userRoutes);

router.use('/projects', projectRoutes);

export default router;
