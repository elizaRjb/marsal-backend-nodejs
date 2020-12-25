import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { generateAuthToken } from '../utils/auth';
import { hashPassword, comparePassword } from '../utils/password';

import * as UserService from '../services/userService';

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function create(req, res) {
  const { users, body: {
    firstName, lastName, email, password
  } } = req;

  if (users.length) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: 'User already exists'
    });
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  };

  const saveUserCallbackSuccess = result => {
    const firstName = result.firstName;
    const lastName = result.lastName;
    const userId = result._id;

    const accessToken = generateAuthToken({ userId }, '24h');

    console.log('INFO: New user created, id: ', userId);

    return res.header('x-auth-token', accessToken).status(StatusCodes.CREATED).send({
      data: [
        {
          firstName,
          lastName,
          userId
        }
      ]
    });
  };

  const passwordHashCallbackSuccess = hashedPassword => {
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword
    }

    UserService.saveUser(userData, saveUserCallbackSuccess, callbackError);
  };

  // Encrypt password
  hashPassword(password, passwordHashCallbackSuccess, callbackError);
}

/**
 * Log in a user.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function login(req, res) {
  const { users, body: { password } } = req;

  if (!users.length) {
    return res.status(StatusCodes.NOT_FOUND).send({
      error: 'User does not exist'
    });
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  };

  const comparePasswordCallbackSuccess = isValid => {
    if (isValid) { // Passwords match
      const { firstName, lastName, _id } = users[0];
      const accessToken = generateAuthToken({ userId: _id }, '24h');

      console.log('INFO: User logged in, id: ', _id);

      return res.header('x-auth-token', accessToken).status(StatusCodes.OK).send({
        message: 'Login successful',
        data: [
          {
            firstName: firstName,
            lastName: lastName,
            userId: _id
          }
        ]
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: 'The password is invalid.'
    });
  }

  // Compare received password with its corresponding hashed password
  comparePassword(password, users[0].password, comparePasswordCallbackSuccess, callbackError);
}