import cors from './cors.js';
import helmet from './helmet.js';
import morgan from './morgan.js';
import common from './common.js';
import ejs from "./ejs.js";

export default (app) => {
  ejs(app);
  morgan(app);
  cors(app);
  helmet(app);
  common(app);
};
