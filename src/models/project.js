import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: String,
  email: String,
  userId: String,
  role: String,
  colorScheme: String
});

const ProjectSchema = new Schema({
  name: String,
  tag: String,
  colorScheme: String,
  description: String,
  members: [MemberSchema]
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
