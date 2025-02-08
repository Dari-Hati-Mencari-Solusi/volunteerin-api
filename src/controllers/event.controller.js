import * as eventModel from '../models/Event.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventModel.getAllEvents();
    res.status(200).json({
      message: 'Berhasil mendapatkan semua event',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
