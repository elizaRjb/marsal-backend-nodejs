import Task from '../models/task';

import { getProjectTag } from './projectService';

/**
 * Find a task by ID.
 *
 * @param {String} taskId
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function findTaskById(taskId, callbackSuccess, callbackError) {
  Task.findById(taskId).then(result => {
    callbackSuccess(result);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Saves a new task to DB.
 *
 * @param {Object} taskData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function saveTask(taskData, callbackSuccess, callbackError) {
  const newTask = new Task(taskData);

  newTask.save().then(result => {
    callbackSuccess(result);
  }).catch(error => {
    console.log('ERROR: ', error);
    callbackError();
  });
}

/**
 * Find tasks of a project.
 *
 * @param {String} projectId
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function findTasksOfProject(projectId, callbackSuccess, callbackError) {
  Task.find({ projectId }).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Find tasks of a project with params.
 *
 * @param {Object} params
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function findTasksOfProjectWithParams(params, callbackSuccess, callbackError) {
  Task.find(params).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Add child task details in childrenTasks of a task.
 *
 * @param {String} taskId
 * @param {Object} childrenTasksData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function updateChildrenTasksListOfTaskById(taskId, childrenTasksData, callbackSuccess, callbackError) {
  Task.findByIdAndUpdate(taskId, { $push: { childrenTasks: { ...childrenTasksData } } }, { new: true }).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Remove child task details in childrenTasks of a task.
 *
 * @param {String} parentTaskId
 * @param {String} childTaskId
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function removeFromChildrenTasksListOfTaskById(parentTaskId, childTaskId, callbackSuccess, callbackError) {
  Task.findByIdAndUpdate(parentTaskId, { $pull: { childrenTasks: { taskId: childTaskId } } }, { new: true }).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Deletes many tasks that has any from the list of ids.
 *
 * @param {Array} idsList
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function deleteManyTasksWithIds(idsList, callbackSuccess, callbackError) {
  Task.deleteMany({ _id: { $in: idsList } }).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Update a task by id.
 *
 * @param {String} taskId
 * @param {Object} updateData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function updateTaskById(taskId, updateData, callbackSuccess, callbackError) {
  Task.findByIdAndUpdate(taskId, updateData, { new: true }).then(results => {
    callbackSuccess(results);
  }).catch(error => {
    console.log('ERROR: ', error);

    callbackError();
  });
}

/**
 * Update a task by id.
 *
 * @param {String} projectId
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function getNextUniqueTaskTag(projectId, callbackSuccess, callbackError) {
  getProjectTag(projectId, (projectTag => {
    Task.findOne({ projectId }, {}, { sort: { 'createdDate': -1 } }).then(prevTask => {
      const taskNum = prevTask && prevTask.taskTag ? +prevTask.taskTag.split('-')[1] : 0;

      callbackSuccess(projectTag + '-' + (taskNum + 1));
    });
  }), callbackError);
}
