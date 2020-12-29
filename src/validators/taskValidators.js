import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import validate from '../utils/validate';

/**
 * Validate get tasks data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function getTasksDataValidator(req, res, next) {
  const schema = Joi.object({
    projectId: Joi.string().required()
  });

  return validate(req.params, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}

/**
 * Validate create task data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function createTaskDataValidator(req, res, next) {
  const assignedToSchema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    userId: Joi.string().required()
  };

  const schema = Joi.object({
    taskTag: Joi.string().required(),
    name: Joi.string().required(),
    assignedTo: Joi.object(assignedToSchema).allow({}),
    dueDate: Joi.alternatives([Joi.date(), Joi.string().valid('')]),
    stage: Joi.string().required(),
    priority: Joi.string().required(),
    description: Joi.string().allow(''),
    parentTaskId: Joi.string().allow(''),
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

/**
 * Validate delete task data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function deleteTaskDataValidator(req, res, next) {
  const schema = Joi.object({
    taskId: Joi.string().required()
  });

  return validate(req.body.data, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}

/**
 * Validate update task data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function updateTaskDataValidator(req, res, next) {
  const assignedToSchema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    userId: Joi.string().required()
  };

  const schema = Joi.object({
    name: Joi.string(),
    assignedTo: Joi.object(assignedToSchema).allow({}),
    dueDate: Joi.alternatives([Joi.date(), Joi.string().valid('')]),
    stage: Joi.string(),
    priority: Joi.string(),
    description: Joi.string().allow(''),
    taskId: Joi.string().required(),
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

/**
 * Validate get tasks data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function getTaskDetailsDataValidator(req, res, next) {
  const schema = Joi.object({
    projectId: Joi.string().required(),
    taskId: Joi.string().required()
  });

  return validate(req.params, schema).then(() => {
    next();
  }).catch(error => {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: error.details[0].message
    });
  });
}

/**
 * Validate add comment data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function addCommentDataValidator(req, res, next) {
  const schema = Joi.object({
    comment: Joi.string().required(),
    projectId: Joi.string().required(),
    taskId: Joi.string().required()
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
 * Validate delete comment data.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function deleteCommentDataValidator(req, res, next) {
  const schema = Joi.object({
    commentId: Joi.string().required(),
    commenterId: Joi.string().required(),
    projectId: Joi.string().required(),
    taskId: Joi.string().required()
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
