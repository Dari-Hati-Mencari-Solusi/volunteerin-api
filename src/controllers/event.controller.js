import * as eventModel from '../models/Event.js';

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
