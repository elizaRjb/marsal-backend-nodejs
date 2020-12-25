import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: String,
  email: String,
  userId: String,
  role: String
});

const ProjectSchema = new Schema({
  name: String,
  tag: String,
  description: String,
  members: [MemberSchema]
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
