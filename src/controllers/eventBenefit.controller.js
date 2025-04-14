import * as eventBenefitModel from '../models/EventBenefit.js';

export const createEventBenefit = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    const eventBenefitData = {
      name,
      icon,
      description,
      createdAt: new Date(),
    };

    const eventBenefit =
      await eventBenefitModel.createEventBenefit(eventBenefitData);

    res.status(201).json({
      message: 'Event Benefit berhasil dibuat',
      data: eventBenefit,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventBenefits = async (req, res, next) => {
  try {
    const eventBenefits = await eventBenefitModel.getAllEventBenefits();

    res.status(200).json({
      message: 'Berhasil mendapatkan daftar event benefits',
      data: eventBenefits,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;

    const eventBenefitData = {
      name,
      icon,
      description,
      updatedAt: new Date(),
    };

    const updatedEventBenefit = await eventBenefitModel.updateEventBenefit(
      id,
      eventBenefitData,
    );

    res.status(200).json({
      message: 'Event Benefit berhasil diperbarui',
      data: updatedEventBenefit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    await eventBenefitModel.deleteEventBenefit(id);

    res.status(200).json({
      message: 'Event Benefit berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
