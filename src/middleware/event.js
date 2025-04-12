import * as eventModel from '../models/Event.js';
import { HttpError } from '../utils/error.js';

export const ensureEventExists = async (req, _, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventModel.getEventById(eventId);

    if (!event) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};

export const ensureEventOwner = async (req, _, next) => {
  try {
    const { id: userId } = req.user;
    const eventId = req.params.id;

    const event = await eventModel.getEventById(eventId);

    if (!event) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    if (event.userId !== userId) {
      throw new HttpError('Anda tidak memiliki akses untuk event ini', 403);
    }

    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};
