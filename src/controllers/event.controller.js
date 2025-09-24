import {
  deleteImageFromImagekit,
  uploadToImageKit,
} from '../utils/imagekit.js';
import { generateSlug } from '../utils/stringManipulation.js';
import { validate as isUUID } from 'uuid';
import { HttpError } from '../utils/error.js';
import * as eventModel from '../models/Event.js';
import * as formModel from '../models/Form.js';
import * as formResponseModel from '../models/FormResponse.js';

export const createEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { benefitIds, categoryIds, ...eventData } = req.body;

    let uploadResponse = await uploadToImageKit(req.file);

    // Konversi tipe data
    const eventDataProcessed = {
      ...eventData,
      maxApplicant: eventData.maxApplicant
        ? parseInt(eventData.maxApplicant, 10)
        : null,
      acceptedQuota: eventData.acceptedQuota
        ? parseInt(eventData.acceptedQuota, 10)
        : null,
      isPaid: eventData.isPaid === 'true' || eventData.isPaid === true,
      isRelease: eventData.isRelease === 'true' || eventData.isRelease === true,
      price: eventData.price ? parseFloat(eventData.price) : 0,
      latitude: eventData.latitude ?? null,
      longitude: eventData.longitude ?? null,
    };

    // Prepare event data
    const eventDataToCreate = {
      userId,
      ...eventDataProcessed,
      slug: generateSlug(eventDataProcessed.title),
      bannerImageId: uploadResponse.fileId,
      bannerUrl: uploadResponse.thumbnailUrl,
      createdAt: new Date(),
    };

    // Create event with categories and save benefitIds as data
    let event = await eventModel.createEvent({
      ...eventDataToCreate,
      categoryIds,
      benefitIds,
    });

    res.status(201).json({
      message: 'Event berhasil dibuat',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { benefitIds, categoryIds, ...eventData } = req.body;

    // Validasi input
    if (!benefitIds || benefitIds.length === 0) {
      return res.status(400).json({
        message: 'Manfaat event tidak boleh kosong',
      });
    }

    if (!categoryIds || categoryIds.length === 0) {
      return res.status(400).json({
        message: 'Kategori tidak boleh kosong',
      });
    }

    // Ambil data event yang ada
    const existingEvent = await eventModel.getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({
        message: 'Event tidak ditemukan',
      });
    }

    // Upload banner baru jika ada
    let bannerData = {};
    if (req.file) {
      if (existingEvent.bannerImageId) {
        await deleteImageFromImagekit(existingEvent.bannerImageId);
      }

      const uploadResponse = await uploadToImageKit(req.file);
      bannerData = {
        bannerImageId: uploadResponse.fileId,
        bannerUrl: uploadResponse.thumbnailUrl,
      };
    }

    // Konversi tipe data
    const eventDataProcessed = {
      ...eventData,
      maxApplicant: eventData.maxApplicant
        ? parseInt(eventData.maxApplicant, 10)
        : null,
      acceptedQuota: eventData.acceptedQuota
        ? parseInt(eventData.acceptedQuota, 10)
        : null,
      isPaid: eventData.isPaid === 'true' || eventData.isPaid === true,
      isRelease: eventData.isRelease === 'true' || eventData.isRelease === true,
      price: eventData.price ? parseFloat(eventData.price) : 0,
      latitude: eventData.latitude ? parseFloat(eventData.latitude) : null,
      longitude: eventData.longitude ? parseFloat(eventData.longitude) : null,
    };

    // Prepare update data
    const dataEventWillUpdate = {
      ...eventDataProcessed,
      ...bannerData,
      updatedAt: new Date(),
    };

    if (dataEventWillUpdate.title) {
      dataEventWillUpdate.slug = generateSlug(dataEventWillUpdate.title);
    }

    // Update event data with categories and benefitIds
    const updatedEvent = await eventModel.updateEventById(id, {
      ...dataEventWillUpdate,
      categoryIds: categoryIds,
      benefitIds: benefitIds,
    });

    res.status(200).json({
      message: 'Event berhasil diupdate',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    // Validasi koordinat jika disediakan
    if ((latitude && !longitude) || (!latitude && longitude)) {
      return res.status(400).json({
        message: 'Latitude dan longitude harus disediakan bersamaan',
      });
    }

    if (latitude && longitude) {
      const userLatitude = parseFloat(latitude);
      const userLongitude = parseFloat(longitude);

      if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return res.status(400).json({
          message: 'Format latitude atau longitude tidak valid',
        });
      }

      if (
        userLatitude < -90 ||
        userLatitude > 90 ||
        userLongitude < -180 ||
        userLongitude > 180
      ) {
        return res.status(400).json({
          message:
            'Koordinat latitude atau longitude berada di luar rentang yang valid',
        });
      }
    }

    const result = await eventModel.getAllEvents(req.query);

    if (!result.events.length) {
      return res.status(404).json({
        message: 'Tidak ada event yang ditemukan',
      });
    }

    let message = 'Daftar event berhasil diambil';

    // Ubah pesan jika menggunakan filter lokasi
    if (latitude && longitude) {
      const { maxDistance = 50 } = req.query;
      message = `Ditemukan ${result.events.length} event dalam radius ${maxDistance} km dari lokasi Anda`;
    }

    res.status(200).json({
      message,
      data: result.events,
      pagination: result.pagination,
      ...(result.locationFilter && { locationFilter: result.locationFilter }),
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { user } = req;
    const events = await eventModel.getEventsByUserId(user.id, req.query);

    res.status(200).json({
      message: 'Berhasil mendapatkan data event',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventModel.getEventById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event tidak ditemukan',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data event',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventModel.getEventById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event tidak ditemukan',
      });
    }

    // Hapus banner image jika ada
    if (event.bannerImageId) {
      await deleteImageFromImagekit(event.bannerImageId);
    }

    // Hapus event
    await eventModel.deleteEvent(id);

    res.status(200).json({
      message: 'Event berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

export const showRegistrationForm = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { id: eventId } = req.params;

    if (!isUUID(eventId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const form = await formModel.getFormsByEventId(eventId);

    if (!form) {
      throw new HttpError('Formulir tidak ditemukan untuk event ini.', 404);
    }

    const hasSubmitted =
      await formResponseModel.getFormResponseByFormIdAndUserId(form.id, userId);

    if (hasSubmitted) {
      throw new HttpError(
        'Kamu sudah mengisi formulir untuk event ini sebelumnya.',
        409,
      );
    }

    return res.status(200).json({
      message: 'Berhasil menampilkan formulir pendaftaran event',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

export const submitRegistration = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: eventId } = req.params;

    if (!isUUID(eventId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const form = await formModel.getFormsByEventId(eventId);
    if (!form) {
      throw new HttpError('Formulir tidak ditemukan untuk event ini.', 404);
    }

    const hasSubmitted =
      await formResponseModel.getFormResponseByFormIdAndUserId(form.id, userId);

    if (hasSubmitted) {
      throw new HttpError(
        'Kamu sudah mengisi formulir untuk event ini sebelumnya.',
        409,
      );
    }

    const data = {
      ...req.body,
      userId,
      submittedAt: new Date(),
    };
    const formResponse = await formResponseModel.createFormResponse(data);

    return res.status(200).json({
      message:
        'Pendaftaran berhasil! Silakan menunggu konfirmasi dari penyelenggara. Kami akan segera mengabari setelah proses review selesai.',
      data: formResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserEventHistory = async (req, res, next) => {
  const { user } = req;

  try {
    const eventHistories = await formResponseModel.getEventRegistrationByUserId(
      user.id,
    );

    res.status(200).json({
      message: 'Data events berhasil didapatkan',
      data: eventHistories,
    });
  } catch (error) {
    next(error);
  }
};
