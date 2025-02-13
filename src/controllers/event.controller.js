import * as eventModel from '../models/Event.js';
import { uploadToImageKit } from '../utils/imagekit.js';
import { HttpError } from '../utils/error.js';

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
    const { id: userId } = req.user;
    const { validatedEventData } = req;

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
    next(error);
  }
};
