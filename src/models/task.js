import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChildTaskSchema = new Schema({
  taskId: String,
  taskTag: String
});

const CommentSchema = new Schema({
  commenterName: String,
  commentedDate: Date,
  comment: String,
  isEdited: { type: Boolean, default: false }
})

const TaskSchema = new Schema({
  taskTag: String,
  name: String,
  assignedTo: {
    name: String,
    email: String,
    userId: String
  },
  dueDate: Date,
  createdDate: Date,
  stage: String,
  priority: String,
  description: String,
  projectId: String,
  parentTaskId: String,
  childrenTasks: [ChildTaskSchema],
  comments: [CommentSchema]
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
