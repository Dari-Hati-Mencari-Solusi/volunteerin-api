import sharp from 'sharp';
import { HttpError } from '../utils/error.js';

export const maxDimensionOfFile = (maxWidth, maxHeight) => {
  return async (req, _res, next) => {
    try {
      const image = sharp(req.file.buffer);
      const { width, height } = await image.metadata();

      if (width > maxWidth || height > maxHeight) {
        throw new HttpError(
          `Dimensi gambar anda terlalu besar. Dimensi gambar maksimal ${maxWidth}px x ${maxHeight}px`,
          400,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
