import multer from 'multer';
import { splitSize } from '../utils/stringManipulation.js';
import { HttpError } from '../utils/error.js';

/**
 * Filtering single file before upload to cloud image
 *
 * @param {string} bodyFileName - your body file name
 * @param {string} maxSize - maximal size of file (ex. 2MB, 1KB, 200KB)
 * @param {Array<string>} allowedTypes - allowed type of file
 * @param {string} errorMessage - error message if received file is not included in allowedTypes
 * @returns
 */
export const uploadSingle = (
  bodyFileName,
  maxSize,
  allowedTypes,
  errorMessage,
) => {
  const [size, unit] = splitSize(maxSize);
  const fileSize = size * (unit === 'KB' ? 1024 : 1024 * 1024);

  return (req, res, next) => {
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize },
      fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
          const error = new Error(errorMessage);
          error.code = 'LIMIT_FILE_TYPES';

          return cb(error, false);
        }

        cb(null, true);
      },
    }).single(bodyFileName)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new HttpError(
              `Ukuran file terlalu besar. Maksimal ${maxSize}`,
              413,
            ),
          );
        }

        if (err.code === 'LIMIT_FILE_TYPES') {
          return next(new HttpError(err.message, 415));
        }

        return next(err);
      }

      next();
    });
  };
};

// UploadMiddleware
