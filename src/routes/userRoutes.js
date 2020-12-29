import express from 'express';

import { findUserByEmail } from '../services/userService';

import { createUser, login } from '../controllers/userController';

import { signupDataValidator, loginDataValidator } from '../validators/userValidators';

const router = express.Router();

/**
 * Sign up a new user.
 * POST api/v1/users/signup.
 */
router.post('/signup', signupDataValidator, findUserByEmail, createUser);

/**
 * Log in a user.
 * POST api/v1/users/login.
 */
router.post('/login', loginDataValidator, findUserByEmail, login);

export default router;
