import cors from './cors.js';
import helmet from './helmet.js';
import morgan from './morgan.js';

export default (app) => {
  morgan(app);
  cors(app);
  helmet(app);
};
