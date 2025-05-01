import * as benefitModel from '../models/benefit.js';

export const createBenefit = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;
    const { id: userId } = req.user;

    const benefitData = {
      userId,
      name,
      icon,
      description,
      createdAt: new Date(),
    };

    const benefit = await benefitModel.createBenefit(benefitData);

    res.status(201).json({
      message: 'Benefit berhasil dibuat',
      data: benefit,
    });
  } catch (error) {
    next(error);
  }
};

export const getBenefits = async (req, res, next) => {
  try {
    const benefits = await benefitModel.getAllBenefits();

    res.status(200).json({
      message: 'Berhasil mendapatkan daftar benefits',
      data: benefits,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBenefits = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const benefits = await benefitModel.getBenefitsByUserId(userId);

    res.status(200).json({
      message: 'Berhasil mendapatkan daftar benefits anda',
      data: benefits,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;

    const benefitData = {
      name,
      icon,
      description,
      updatedAt: new Date(),
    };

    const updatedBenefit = await benefitModel.updateBenefit(id, benefitData);

    res.status(200).json({
      message: 'Benefit berhasil diperbarui',
      data: updatedBenefit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    await benefitModel.deleteBenefit(id);

    res.status(200).json({
      message: 'Benefit berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
