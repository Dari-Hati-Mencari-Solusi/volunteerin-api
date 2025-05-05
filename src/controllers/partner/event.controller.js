import * as eventModel from '../../models/Event.js';
import {
  deleteImageFromImagekit,
  uploadToImageKit,
} from '../../utils/imagekit.js';
import { generateSlug } from '../../utils/stringManipulation.js';

export const createEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
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

    // Upload banner image
    let uploadResponse = null;
    if (req.file) {
      uploadResponse = await uploadToImageKit(req.file);
    } else {
      return res.status(400).json({
        message: 'Banner event tidak boleh kosong',
      });
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
      categoryIds: categoryIds,
      benefitIds: benefitIds,
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
    const result = await eventModel.getAllEvents(req.query);

    if (!result.events.length) {
      return res.status(400).json({
        message: 'Tidak ada event yang ditemukan',
      });
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
