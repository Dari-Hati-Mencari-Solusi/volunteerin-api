import * as eventBenefitModel from '../models/eventBenefit.js';
import { HttpError } from '../utils/error.js';
import prisma from '../configs/dbConfig.js';

export const getAllEventBenefits = async (req, res, next) => {
  try {
    const result = await eventBenefitModel.getAllEventBenefits(req.query);

    if (!result.eventBenefits.length) {
      throw new HttpError('Tidak ada event benefit yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar event benefit berhasil diambil',
      data: result.eventBenefits,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new HttpError('ID event benefit tidak valid', 400);
    }

    const eventBenefit = await eventBenefitModel.getEventBenefitById(id);

    if (!eventBenefit) {
      throw new HttpError('Event benefit tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Event benefit berhasil diambil',
      data: eventBenefit,
    });
  } catch (error) {
    next(error);
  }
};

export const createEventBenefit = async (req, res, next) => {
  try {
    const { eventId, benefitId } = req.body;

    // Validasi event
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    // Validasi benefit
    const existingBenefit = await prisma.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!existingBenefit) {
      throw new HttpError('Benefit tidak ditemukan', 404);
    }

    const eventBenefit = await eventBenefitModel.createEventBenefit({
      eventId,
      benefitId,
    });

    res.status(201).json({
      message: 'Event benefit berhasil dibuat',
      data: eventBenefit,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating event benefit:', error);
    }
    next(error);
  }
};

export const updateEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { eventId, benefitId } = req.body;

    if (!id) {
      throw new HttpError('ID event benefit tidak valid', 400);
    }

    // Cek apakah event benefit ada
    const existingEventBenefit =
      await eventBenefitModel.getEventBenefitById(id);

    if (!existingEventBenefit) {
      throw new HttpError('Event benefit tidak ditemukan', 404);
    }

    // Validasi event
    if (eventId && eventId !== existingEventBenefit.eventId) {
      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent) {
        throw new HttpError('Event tidak ditemukan', 404);
      }
    }

    // Validasi benefit
    if (benefitId && benefitId !== existingEventBenefit.benefitId) {
      const existingBenefit = await prisma.benefit.findUnique({
        where: { id: benefitId },
      });

      if (!existingBenefit) {
        throw new HttpError('Benefit tidak ditemukan', 404);
      }
    }

    const updatedEventBenefit = await eventBenefitModel.updateEventBenefit(id, {
      eventId: eventId || existingEventBenefit.eventId,
      benefitId: benefitId || existingEventBenefit.benefitId,
    });

    res.status(200).json({
      message: 'Event benefit berhasil diperbarui',
      data: updatedEventBenefit,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating event benefit:', error);
    }
    next(error);
  }
};

export const deleteEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new HttpError('ID event benefit tidak valid', 400);
    }

    // Cek apakah event benefit ada
    const existingEventBenefit =
      await eventBenefitModel.getEventBenefitById(id);

    if (!existingEventBenefit) {
      throw new HttpError('Event benefit tidak ditemukan', 404);
    }

    await eventBenefitModel.deleteEventBenefit(id);

    res.status(200).json({
      message: 'Event benefit berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting event benefit:', error);
    }
    next(error);
  }
};
