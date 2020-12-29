import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import validate from '../utils/validate';

/**
 * Validate create project data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function createProjectDataValidator(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    tag: Joi.string().min(2).max(5).required(),
    description: Joi.string().allow(''),
    userId: Joi.string()
  });

  const data = { ...req.body.data, ...req.params };

  return validate(data, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}

/**
 * Validate add user in project data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function addUserInProjectDataValidator(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    projectId: Joi.string().required()
  });

  const data = { ...req.body.data, ...req.params };

  return validate(data, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}
