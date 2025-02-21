import * as eventModel from '../models/Event.js';
import { uploadToImageKit } from '../utils/imagekit.js';
import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const result = await eventModel.getAllEvents(req.query);

    if (!result.events.length) {
      throw new HttpError('Tidak ada event yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar event berhasil diambil',
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID event tidak valid', 400);
    }

    const event = await eventModel.getEventById(id);

    if (!event) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Event berhasil diambil',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { validatedEventData } = req;

    // Cek quota event partner
    const partnerProfile = await prisma.partnerProfile.findUnique({
      where: { userId },
    });

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    const existingEventCount = await prisma.event.count({
      where: { userId },
    });

    if (existingEventCount >= partnerProfile.eventQuota) {
      throw new HttpError(
        'Anda telah mencapai batas maksimum pembuatan event. Silakan upgrade ke premium untuk menambah quota event.',
        403,
      );
    }

    const imageUrl = await uploadToImageKit(req.file);

    const eventData = {
      ...validatedEventData,
      userId,
      bannerUrl: imageUrl,
    };

    const event = await eventModel.createEvent(eventData);

    res.status(201).json({
      message: 'Event berhasil dibuat',
      data: event,
    });
  } catch (error) {
    // Jika error bukan instance dari HttpError, akan diteruskan ke error handler global
    if (!(error instanceof HttpError)) {
      console.error('Error creating event:', error);
    }
    next(error);
  }
};
