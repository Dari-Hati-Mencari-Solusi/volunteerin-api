import morgan from 'morgan';

export default (app) => {
  app.use(morgan('combined'));
};
