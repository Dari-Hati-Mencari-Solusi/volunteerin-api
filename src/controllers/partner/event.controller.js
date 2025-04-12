import * as eventModel from '../../models/Event.js';
import {
  deleteImageFromImagekit,
  uploadToImageKit,
} from '../../utils/imagekit.js';
import { generateSlug } from '../../utils/stringManipulation.js';

export const createEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const uploadResponse = await uploadToImageKit(req.file);

    const eventData = {
      userId,
      ...req.body,
      slug: generateSlug(req.body.title),
      bannerImageId: uploadResponse.fileId,
      bannerUrl: uploadResponse.thumbnailUrl,
      createdAt: new Date(),
    };

    const event = await eventModel.createEvent(eventData);

    res.status(201).json({
      message: 'Event berhasil dibuat',
      data: event,
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

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    let bannerData = {};
    if (req.file) {
      const event = await eventModel.getEventById(id);

      if (event.bannerImageId) {
        await deleteImageFromImagekit(event.bannerImageId);
      }

      const uploadResponse = await uploadToImageKit(req.file);
      bannerData = {
        bannerImageId: uploadResponse.fileId,
        bannerUrl: uploadResponse.thumbnailUrl,
      };
    }

    const dataEventWillUpdate = {
      ...req.body,
      ...bannerData,
    };

    if (dataEventWillUpdate.title) {
      dataEventWillUpdate.slug = generateSlug(dataEventWillUpdate.title);
    }

    dataEventWillUpdate.updatedAt = new Date();

    const eventAfterUpdate = await eventModel.updateEventById(
      id,
      dataEventWillUpdate,
    );

    res.status(200).json({
      message: 'Event berhasil diupdate',
      data: eventAfterUpdate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await eventModel.getEventById(id);

    if (event.bannerImageId) {
      await deleteImageFromImagekit(event.bannerImageId);
    }

    await eventModel.deleteEvent(id);

    res.status(200).json({
      message: 'Event berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
