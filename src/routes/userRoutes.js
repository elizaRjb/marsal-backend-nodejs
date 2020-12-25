import express from 'express';

import { findUserByEmail } from '../services/userService';

import { create, login } from '../controllers/userController';

import { signupDataValidator, loginDataValidator } from '../validators/userValidators';

const router = express.Router();

// Sign up
router.post('/signup', signupDataValidator, findUserByEmail, create);

// Log in
router.post('/login', loginDataValidator, findUserByEmail, login);

export default router;
