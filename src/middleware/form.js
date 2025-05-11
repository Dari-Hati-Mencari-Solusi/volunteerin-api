import * as formModel from '../models/Form.js';
import * as eventModel from '../models/Event.js';
import { HttpError } from '../utils/error.js';

export const ensureFormExists = async (req, _, next) => {
  try {
    const formId = req.params.id;
    const form = await formModel.getFormById(formId);

    if (!form) {
      throw new HttpError('Form tidak ditemukan', 404);
    }

    req.form = form;
    next();
  } catch (error) {
    next(error);
  }
};

export const ensureFormOwner = async (req, _, next) => {
  try {
    const { id: userId } = req.user;
    const formId = req.params.id;

    const form = await formModel.getFormById(formId);

    if (!form) {
      throw new HttpError('Form tidak ditemukan', 404);
    }

    // Admin dapat mengakses semua form
    if (req.user.role === 'ADMIN') {
      req.form = form;
      return next();
    }

    // Verifikasi apakah event milik partner ini
    const event = await eventModel.getEventById(form.eventId);

    if (!event) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    // Partner hanya boleh mengakses form untuk event yang dia buat
    if (event.userId !== userId) {
      throw new HttpError('Anda tidak memiliki akses untuk form ini', 403);
    }

    req.form = form;
    next();
  } catch (error) {
    next(error);
  }
};
