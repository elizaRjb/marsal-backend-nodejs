import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import validate from '../utils/validate';

/**
 * Validate sign up data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function signupDataValidator(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
  });

  return validate(req.body, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}

/**
 * Validate log in data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function loginDataValidator(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
  });

  return validate(req.body, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}
