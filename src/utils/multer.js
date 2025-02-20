import multer from 'multer';
import { HttpError } from './error.js';

const limits = {
  fileSize: 3 * 1024 * 1024, //3MB
  files: 1,
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new HttpError('File harus berupa gambar!', 400), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: limits,
}).single('banner');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(new HttpError(`Error upload file: ${err.message}`, 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

export default uploadMiddleware;
