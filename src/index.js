import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middleware/error.js';
import loaders from './loaders/index.js';

const app = express();

dotenv.config();

loaders(app);
routes(app);

errorHandler(app);

export default app;
