import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import initRoutes from './routes/index.js';
import errorHandler from './middleware/error.js';

const app = express();

dotenv.config();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initRoutes(app);

errorHandler(app);

export default app;
