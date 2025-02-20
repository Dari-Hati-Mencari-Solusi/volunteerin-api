import imagekit from '../configs/imageKitConfig.js';
import { HttpError } from './error.js';

export const uploadToImageKit = async (file) => {
  try {
    if (!file) {
      throw new HttpError('File tidak ditemukan!', 400);
    }

    const base64 = file.buffer.toString('base64');

    const uploadResponse = await imagekit.upload({
      file: base64,
      fileName: `${Date.now()}-${file.originalname}`,
    });

    return uploadResponse.url;
  } catch (err) {
    throw err instanceof HttpError
      ? err
      : new HttpError('Gagal mengunggah gambar!', 500);
  }
};
