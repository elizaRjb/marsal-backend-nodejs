import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => console.log('DB connected'),
  error => console.log('DB CONNECTION ERROR: ', error)
);
