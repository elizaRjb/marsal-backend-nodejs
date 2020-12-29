import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { USER_ROLES } from '../utils/constants';

import { findUser } from '../services/userService';
import { saveProject, saveMemberInProject } from '../services/projectService';

/**
 * Get projects list of a user.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function getProjects(req, res) {
  const { projects } = req;

  return res.status(StatusCodes.OK).send({
    data: projects
  });
}

/**
 * Create a project for a user.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function createProject(req, res) {
  const { userId } = req.currentUser;

  const { name, tag, description } = req.body.data;

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  }

  const saveProjectCallbackSuccess = result => {
    console.log('INFO: Project created, id: ', result._id);

    return res.status(StatusCodes.CREATED).send({
      message: 'Project saved successfully.',
      data: result
    });
  };

  const findUserCallbackSuccess = users => {
    if (users.length) {
      const { firstName, lastName, email, _id } = users[0];

      const memberName = `${firstName} ${lastName}`;

      const projectData = {
        name,
        tag: tag.toUpperCase(),
        description,
        members: [
          {
            name: memberName,
            email,
            userId: _id,
            role: USER_ROLES.admin
          }
        ]
      }

      saveProject(projectData, saveProjectCallbackSuccess, callbackError);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send({
        error: 'User with given id does not exist.'
      });
    }
  }

  findUser({ _id: userId }, findUserCallbackSuccess, callbackError);
}

/**
 * Add user in a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function addUserInProject(req, res) {
  const { users, projects } = req;

  if (!users.length) {
    return res.status(StatusCodes.NOT_FOUND).send({
      error: 'The requested user does not exist.'
    });
  }

  if (!projects.length) {
    return res.status(StatusCodes.NOT_FOUND).send({
      error: 'The project does not exist.'
    });
  }

  const membersList = projects[0].members.filter(item => {
    // eslint-disable-next-line eqeqeq
    return item.userId == users[0]._id;
  });

  if (membersList.length) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: 'The user is already a member of this project.'
    });
  }

  const memberData = {
    name: `${users[0].firstName} ${users[0].lastName}`,
    email: users[0].email,
    userId: users[0]._id,
    role: USER_ROLES.user
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  };

  saveMemberInProject(memberData, projects[0]._id, () => {
    console.log(`INFO: New member added. Member id: ${memberData.userId}, Project id: ${projects[0]._id}`);

    return res.status(StatusCodes.OK).send({
      message: 'New member added successfully.'
    });
  }, callbackError);
}
