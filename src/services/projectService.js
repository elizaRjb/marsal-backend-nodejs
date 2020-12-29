import '../env';

import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import Project from '../models/project';

/**
 * Find project by project ID.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findProjectById(req, res, next) {
  const { projectId } = req.params;

  Project.find({ _id: projectId }).then(results => {
    req.projects = results;
    next();
  }).catch(error => {
    console.log('ERROR: ', error);
  
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  });
}

/**
 * Find projects by userId.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findProjectsByUserId(req, res, next) {
  const { userId } = req.currentUser;

  Project.find({ 'members.userId': userId }).then(results => {
    req.projects = results;
    next();
  }).catch(error => {
    console.log('ERROR: ', error);
  
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  });
}

/**
 * Verify if the user is a member of the project.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function verifyUserIsProjectMember(req, res, next) {
  const { userId } = req.currentUser;
  const { projectId } = req.params;

  Project.findById(projectId).then(results => {
    if (!results) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        error: 'Project with the given ID could not be found.'
      });
    }

    let user = [];

    if (results.members && results.members.length !== 0) {
      // Get members with given user id
      user = results.members.filter(item => {
        // eslint-disable-next-line eqeqeq
        return item.userId == userId;
      })
    }

    if (user.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        error: 'The user does not have access to the project.'
      });
    }

    next();
  }).catch(error => {
    console.log('ERROR: ', error);

    return res.status(StatusCodes.BAD_REQUEST).send({
      error: 'Invalid project ID'
    });
  });
}

/**
 * Saves a new project to DB.
 *
 * @param {Object} projectData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function saveProject(projectData, callbackSuccess, callbackError) {
  const newProject = new Project(projectData);

  newProject.save().then(result => {
    callbackSuccess(result);
  }).catch(error => {
    console.log('ERROR: ', error);
    callbackError();
  });
}

/**
 * Saves new member in a project in DB.
 *
 * @param {Object} memberData
 * @param {String} projectId
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function saveMemberInProject(memberData, projectId, callbackSuccess, callbackError) {
  Project.updateOne({ _id: projectId }, { $push: { members: memberData } }).then(result => {
    callbackSuccess(result);
  }).catch(error => {
    console.log("ERROR: ", error);
    callbackError();
  })
}
