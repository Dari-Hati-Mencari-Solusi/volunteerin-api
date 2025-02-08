import multer from 'multer';
import { HttpError } from './error.js';

/**
 * Konfigurasi untuk file filtering
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new HttpError('File harus berupa gambar!', 400), false);
  }
};

/**
 * Konfigurasi untuk file size limits
 */
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 1, // Max number of files
};

/**
 * Inisialisasi multer dengan memory storage
 */
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: limits,
});

export default upload;
