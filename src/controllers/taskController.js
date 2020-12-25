import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import {
  saveTask,
  findTaskById,
  updateTaskById,
  findTasksOfProject,
  deleteManyTasksWithIds,
  updateChildrenTasksListOfTaskById,
  removeFromChildrenTasksListOfTaskById,
} from '../services/taskService';

/**
 * Create a task in a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function createTask(req, res) {
  const { data } = req.body;
  const { projectId } = req.params;

  const parentTaskId = data.parentTaskId;

  // Check if parent id exists
  if (parentTaskId) {
    findTaskById(parentTaskId, result => {
      if (!result) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          error: 'The parent task does not exist.'
        });
      }
    }, () => {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR
      });
    });
  }

  const createdDate = new Date();

  const taskData = {
    ...data,
    createdDate,
    projectId
  }

  const callbackSuccess = (result) => {
    console.log('Task created. id: ', result._id);

    return res.status(StatusCodes.CREATED).send({
      message: 'Task created successfully',
      data: result
    });
  }

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    })
  };

  saveTask(taskData, result => {
    const childTaskData = {
      taskId: result._id,
      taskTag: result.taskTag
    }

    if (parentTaskId) {
      // If parent task exists
      // Update children tasks of parent task
      updateChildrenTasksListOfTaskById(parentTaskId, childTaskData, () => callbackSuccess(result), callbackError);

      return;
    }

    callbackSuccess(result);

  }, callbackError);
}

/**
 * Create a task in a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function getTasks(req, res) {
  const { projectId } = req.params;

  const callbackError = () => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  }

  const callbackSuccess = (results) => {
    return res.status(StatusCodes.OK).send({
      data: results
    });
  }

  findTasksOfProject(projectId, callbackSuccess, callbackError);
}

/**
 * Delete a task (and its child tasks, if any) in a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function deleteTask(req, res) {
  const { taskId } = req.body.data;

  const callbackError = () => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  }

  const callbackSuccess = () => {
    return res.status(StatusCodes.OK).send({
      message: 'Task deleted successfully.'
    });
  }

  const getChildrenTasksIds = childrenTasks => {
    return childrenTasks.map(item => {
      return item.taskId;
    });
  }

  // Delete a task as well as its children (if any)
  const deleteTasks = result => {
    const childrenTasks = result.childrenTasks;

    const childrenTaskIds = (childrenTasks && childrenTasks.length !== 0) ? getChildrenTasksIds(childrenTasks) : [];

    const taskIds = [...childrenTaskIds, taskId];

    deleteManyTasksWithIds(taskIds, callbackSuccess, callbackError);
  }

  findTaskById(taskId, result => {
    const parentTaskId = result.parentTaskId;

    if (parentTaskId) {
      // Remove task data from its parent's children tasks
      removeFromChildrenTasksListOfTaskById(parentTaskId, taskId, () => {
        deleteTasks(result);
      }, callbackError);

      return;
    }

    deleteTasks(result);
  }, callbackError);
}

/**
 * Update a task in a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function updateTask(req, res) {
  const { taskId } = req.params;

  const { data } = req.body;

  const callbackError = () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  };

  const callbackSuccess = (result) => {
    console.log('Task updated, id: ', result._id);

    return res.status(StatusCodes.OK).send({
      message: 'Task updated successfully.',
      data: result
    })
  }

  updateTaskById(taskId, data, callbackSuccess, callbackError);
}

/**
 * Get details of a task of a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function getTaskDetails(req, res) {
  const { taskId } = req.params;

  findTaskById(taskId, result => {
    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        error: 'The task does not exist.'
      });
    }

    return res.status(StatusCodes.OK).send({
      data: result
    })
  }, () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  });
}

/**
 * Add a comment in a task of a project.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function addComment(req, res) {
  const { taskId } = req.params;

  const { data } = req.body;

  updateTaskById(taskId, { $push: { comments: data } }, result => {
    console.log(`Comment added to task ${taskId}`);

    res.status(StatusCodes.OK).send({
      message: 'Comment added sucessfully.',
      data: result.comments
    })
  }, () => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR
    });
  })
}
