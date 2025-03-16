import * as eventModel from '../models/Event.js';
import { uploadToImageKit } from '../utils/imagekit.js';
import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

//partner
export const getPartnerEvents = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const { id: userId } = req.user;
    const {
      name,
      category,
      start,
      end,
      publish,
      page = 1,
      limit = 10,
    } = req.query;

    // Validasi akses
    if (partnerId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk melihat event milik partner ini',
        403,
      );
    }

    const result = await eventModel.getPartnerEvents({
      userId: partnerId,
      name,
      category,
      start,
      end,
      publish: publish !== undefined ? publish === '1' : undefined,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: 'Daftar event partner berhasil diambil',
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const createPartnerEvent = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const { id: userId } = req.user;
    const { validatedEventData } = req;

    // Validasi akses
    if (partnerId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk membuat event untuk partner ini',
        403,
      );
    }

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

    // Cek judul event sudah ada atau belum
    const existingEventTitle = await prisma.event.findFirst({
      where: {
        title: validatedEventData.title,
        userId,
      },
    });

    if (existingEventTitle) {
      throw new HttpError(
        'Judul event sudah digunakan, mohon gunakan judul lain',
        400,
      );
    }

    const imageUrl = await uploadToImageKit(req.file);

    // Generate slug dari title
    const slug = validatedEventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const eventData = {
      ...validatedEventData,
      userId,
      slug,
      bannerUrl: imageUrl,
    };

    const event = await eventModel.createEvent(eventData);

    res.status(201).json({
      message: 'Event berhasil dibuat',
      data: event,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating event:', error);
    }
    next(error);
  }
};

export const getPartnerEventDetail = async (req, res, next) => {
  try {
    const { partnerId, eventId } = req.params;
    const { id: userId } = req.user;

    // Validasi akses
    if (partnerId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk melihat event milik partner ini',
        403,
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        userId: partnerId,
      },
      include: {
        categories: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participations: true,
        forms: true,
      },
    });

    if (!event) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Detail event berhasil diambil',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

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
    if (!(error instanceof HttpError)) {
      console.error('Error creating event:', error);
    }
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { validatedEventData } = req;

    if (!id || isNaN(id)) {
      throw new HttpError('ID event tidak valid', 400);
    }

    const existingEvent = await eventModel.getEventById(id);

    if (!existingEvent) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    if (existingEvent.userId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk mengubah event ini',
        403,
      );
    }

    let imageUrl = existingEvent.bannerUrl;
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file);
    }

    const eventData = {
      ...validatedEventData,
      bannerUrl: imageUrl,
    };

    const event = await eventModel.updateEvent(parseInt(id), eventData);

    res.status(200).json({
      message: 'Event berhasil diperbarui',
      data: event,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating event:', error);
    }
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    if (!id || isNaN(id)) {
      throw new HttpError('ID event tidak valid', 400);
    }

    const existingEvent = await eventModel.getEventById(id);

    if (!existingEvent) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    if (existingEvent.userId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk menghapus event ini',
        403,
      );
    }

    await eventModel.deleteEvent(parseInt(id));

    res.status(200).json({
      message: 'Event berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting event:', error);
    }
    next(error);
  }
};
