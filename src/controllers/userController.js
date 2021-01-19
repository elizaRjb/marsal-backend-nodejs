import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { generateAuthToken } from '../utils/auth';
import { COLOR_SCHEMES } from '../utils/constants';
import { getRandomValueFromList } from '../utils/utils';
import { hashPassword, comparePassword } from '../utils/password';

import * as UserService from '../services/userService';

/**
 * Create a new user.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function createUser(req, res) {
  const {
    users,
    body: {
      data: { firstName, lastName, email, password }
    }
  } = req;

  if (users.length) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: 'User already exists.'
    });
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  };

  const saveUserCallbackSuccess = result => {
    const { firstName, lastName, colorScheme, _id, email } = result;

    const data = {
      name: `${firstName} ${lastName}`,
      userId: _id
    }

    const accessToken = generateAuthToken(data, '24h');

    console.log('INFO: New user created, id: ', _id);

    return res.status(StatusCodes.CREATED).send({
      message: 'User created successfully.',
      data: {
        userInfo: { ...data, email, colorScheme },
        token: { accessToken }
      }
    });
  };

  const passwordHashCallbackSuccess = hashedPassword => {
    const userData = {
      firstName,
      lastName,
      email,
      colorScheme: getRandomValueFromList(COLOR_SCHEMES),
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
  const { users, body: { data: { password } } } = req;

  if (!users.length) {
    return res.status(StatusCodes.NOT_FOUND).send({
      error: 'User does not exist.'
    });
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  };

  const comparePasswordCallbackSuccess = isValid => {
    if (isValid) { // Passwords match
      const { firstName, lastName, colorScheme, _id, email } = users[0];

      const data = {
        name: `${firstName} ${lastName}`,
        userId: _id
      }

      const accessToken = generateAuthToken(data, '24h');

      console.log('INFO: User logged in, id: ', _id);

      return res.header('x-auth-token', accessToken).status(StatusCodes.OK).send({
        message: 'Login successful.',
        data: {
          userInfo: { ...data, email, colorScheme },
          token: { accessToken }
        }
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: 'The password is invalid.'
    });
  }

  // Compare received password with its corresponding hashed password
  comparePassword(password, users[0].password, comparePasswordCallbackSuccess, callbackError);
}
