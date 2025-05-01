// controllers/partner/event.controller.js
import * as eventModel from '../models/Event.js';
import * as eventBenefitModel from '../models/EventBenefit.js';
import {
  deleteImageFromImagekit,
  uploadToImageKit,
} from '../utils/imagekit.js';
import { generateSlug } from '../utils/stringManipulation.js';

export const createEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { benefitIds, categoryIds, ...eventData } = req.body;

    // Validasi bahwa benefitIds dan categoryIds ada
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

    // Konversi tipe data yang perlu dikonversi
    const eventDataProcessed = {
      ...eventData,
      // Konversi nilai string numerik ke tipe data yang sesuai
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

    // Create event first
    let event = await eventModel.createEvent({
      ...eventDataToCreate,
      categoryIds: categoryIds,
    });

    // Kemudian tambahkan relasi dengan benefits menggunakan tabel pivot event_benefits
    try {
      if (benefitIds && benefitIds.length > 0) {
        // Gunakan method batch untuk tambah benefits
        await eventBenefitModel.createEventBenefits(event.id, benefitIds);
      }
    } catch (error) {
      console.error('Error creating event benefits:', error);
    }

    // Ambil event lengkap dengan semua relasi
    const eventWithBenefits = await eventModel.getEventById(event.id);

    res.status(201).json({
      message: 'Event berhasil dibuat',
      data: eventWithBenefits,
    });
  } catch (error) {
    console.error('Error creating event:', error);
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
        // Hapus banner lama
        await deleteImageFromImagekit(existingEvent.bannerImageId);
      }

      const uploadResponse = await uploadToImageKit(req.file);
      bannerData = {
        bannerImageId: uploadResponse.fileId,
        bannerUrl: uploadResponse.thumbnailUrl,
      };
    }

    // Konversi tipe data yang perlu dikonversi
    const eventDataProcessed = {
      ...eventData,
      // Konversi nilai string numerik ke tipe data yang sesuai
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

    // Update event data
    await eventModel.updateEventById(id, {
      ...dataEventWillUpdate,
      categoryIds: categoryIds,
    });

    // Update event benefits
    try {
      if (benefitIds && benefitIds.length > 0) {
        // Gunakan method yang lebih aman untuk update benefits
        await eventBenefitModel.updateEventBenefits(id, benefitIds);
      }
    } catch (error) {
      console.error('Error updating event benefits:', error);
    }

    // Ambil event yang sudah diupdate lengkap dengan relasi
    const updatedEvent = await eventModel.getEventById(id);

    res.status(200).json({
      message: 'Event berhasil diupdate',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
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

    // Hapus semua relasi benefit
    try {
      await eventBenefitModel.deleteEventBenefitsByEventId(id);
    } catch (error) {
      console.error('Error deleting event benefits:', error);
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
