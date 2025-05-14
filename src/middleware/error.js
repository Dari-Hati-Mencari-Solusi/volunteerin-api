import { HttpError } from '../utils/error.js';

const notFound = (_req, _res, next) => {
  const notFoundError = new HttpError(
    'Alamat yang dituju tidak ditemukan',
    404,
  );
  next(notFoundError);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err instanceof HttpError) {
    res.status(statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    const debug = process.env.APP_DEBUG;
    
    if (debug == 'true') {
      console.log(err)  
    }

    res
      .status(statusCode)
      .json({ message: 'Terjadi kesalahan server, coba lagi nanti' });
    return;
  }
};

export default (app) => {
  app.use(notFound);
  app.use(errorHandler);
};
