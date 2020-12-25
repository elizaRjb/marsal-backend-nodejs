import Task from '../models/task';

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
  const newProject = new Task(taskData);

  newProject.save().then(result => {
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
 * Add child task details in childrenTasks of a task.
 *
 * @param {String} taskId
 * @param {Object} childrenTasksData
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function updateChildrenTasksListOfTaskById(taskId, childrenTasksData, callbackSuccess, callbackError) {
  console.log(childrenTasksData);
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
