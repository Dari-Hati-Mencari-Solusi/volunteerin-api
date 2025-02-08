import ImageKit from 'imagekit';
import { HttpError } from './error.js';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

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
    throw new HttpError('Gagal mengunggah gambar!', 500);
  }
};

export const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    throw new HttpError('Gagal menghapus gambar!', 500);
  }
};
