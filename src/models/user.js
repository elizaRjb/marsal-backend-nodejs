import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  colorScheme: String
});

const User = mongoose.model('User', UserSchema);

export default User;
