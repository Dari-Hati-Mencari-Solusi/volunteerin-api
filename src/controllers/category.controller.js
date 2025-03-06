import * as categoryModel from '../models/Category.js';
import { HttpError } from '../utils/error.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryModel.getAllCategories(req.query);

    if (!result.categories.length) {
      throw new HttpError('Tidak ada kategori yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar kategori berhasil diambil',
      data: result.categories,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Kategori berhasil diambil',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { validatedCategoryData } = req;

    const category = await categoryModel.createCategory(validatedCategoryData);

    res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: category,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating category:', error);
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { validatedCategoryData } = req;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const existingCategory = await categoryModel.getCategoryById(id);

    if (!existingCategory) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    const category = await categoryModel.updateCategory(
      parseInt(id),
      validatedCategoryData,
    );

    res.status(200).json({
      message: 'Kategori berhasil diperbarui',
      data: category,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating category:', error);
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const existingCategory = await categoryModel.getCategoryById(id);

    if (!existingCategory) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    await categoryModel.deleteCategory(parseInt(id));

    res.status(200).json({
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting category:', error);
    }
    next(error);
  }
};
