import * as eventModel from '../models/Event.js';
import { uploadToImageKit } from '../utils/imagekit.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventModel.getAllEvents(req.query);

    res.status(200).json({
      message: 'Daftar event berhasil diambil',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const bannerFile = req.file;
    if (!bannerFile) {
      return res.status(400).json({
        message: 'Banner event harus diunggah!',
      });
    }

    if (!req.body.categories || !Array.isArray(req.body.categories)) {
      return res.status(400).json({
        message: 'Categories harus berupa array!',
      });
    }

    const imageUrl = await uploadToImageKit(bannerFile);
    const eventData = {
      ...req.body,
      userId: req.user.id,
      bannerUrl: imageUrl,
      startAt: new Date(req.body.startAt),
      endAt: req.body.endAt ? new Date(req.body.endAt) : null,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      categories: req.body.categories.map(Number),
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
