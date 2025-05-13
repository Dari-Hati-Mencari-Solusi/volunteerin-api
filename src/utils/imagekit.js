import imagekit from '../configs/imageKitConfig.js';
import { HttpError } from './error.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadToImageKit = async (file) => {
  try {
    if (!file) {
      throw new HttpError('File tidak ditemukan!', 400);
    }

    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${uuidv4()}`,
    });

    return uploadResponse;
  } catch (error) {
    throw error instanceof HttpError
      ? error
      : new HttpError('Gagal mengunggah gambar', 500);
  }
};

export const deleteImageFromImagekit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch(error) {
    throw new HttpError('Gagal mengubah gambar!', 500)
  }
} 
