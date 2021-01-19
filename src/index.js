import './env';
import './db';

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();

app.use(cors());

// For accepting post form data
app.use(bodyParser.json());

// API routes
app.use('/api/v1', routes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
