import * as formModel from '../../models/Form.js';

export const createForm = async (req, res, next) => {
  try {
    const { eventId, content } = req.body;
    const { id: userId } = req.user;

    const formData = {
      eventId,
      content,
      createdAt: new Date(),
    };

    const form = await formModel.createForm(formData);

    res.status(201).json({
      message: 'Form berhasil dibuat',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

export const getForms = async (req, res, next) => {
  try {
    const forms = await formModel.getAllForms();

    res.status(200).json({
      message: 'Berhasil mendapatkan daftar forms',
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await formModel.getFormById(id);

    if (!form) {
      return res.status(404).json({
        message: 'Form tidak ditemukan',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan form',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyForms = async (req, res, next) => {
  try {
    const { id: partnerId } = req.user;
    const forms = await formModel.getFormsByPartnerId(partnerId);

    res.status(200).json({
      message: 'Berhasil mendapatkan daftar forms anda',
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const formData = {
      content,
      updatedAt: new Date(),
    };

    const updatedForm = await formModel.updateForm(id, formData);

    res.status(200).json({
      message: 'Form berhasil diperbarui',
      data: updatedForm,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    await formModel.deleteForm(id);

    res.status(200).json({
      message: 'Form berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
