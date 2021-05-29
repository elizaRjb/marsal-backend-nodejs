import '../env';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import User from '../models/user';

/**
 * Find user by email.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findUserByEmail(req, res, next) {
  const { email } = req.body.data;

  User.find({ email }).then(results => {
    req.users = results;
    next();
  }).catch(error => {
    console.log('ERROR: ', error);
  
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  });
}

/**
 * Find user by params.
 *
 * @param {Object} params
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function findUser(params, callbackSuccess, callbackError) {
  User.find(params).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);
  
    callbackError();
  });
}

/**
 * Saves a new user to DB.
 *
 * @param {Object} userData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function saveUser(userData, callbackSuccess, callbackError) {
  const newUser = new User(userData);

  newUser.save().then(result => {
    callbackSuccess(result);
  }).catch(error => {
    console.log('ERROR: ', error);
    callbackError();
  });
}
